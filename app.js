// === 1. SIMPLE SESSION MANAGEMENT (No Firebase) ===
        // App State
        let currentUser = null;
        let currentView = 'dashboard';
        
        // Helper function to get registered users from localStorage
        function getRegisteredUsers() {
            const users = localStorage.getItem('registeredUsers');
            return users ? JSON.parse(users) : {};
        }
        
        // Helper function to save registered users to localStorage
        function saveRegisteredUsers(users) {
            localStorage.setItem('registeredUsers', JSON.stringify(users));
        }

        // DOM Elements
        const authPage = document.getElementById('authPage');
        const dashboardPage = document.getElementById('dashboardPage');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const logActivityModal = document.getElementById('logActivityModal');

        // Password Toggle Functionality
        function setupPasswordToggle(inputId, toggleBtnId) {
            const input = document.getElementById(inputId);
            const toggleBtn = document.getElementById(toggleBtnId);
            
            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    toggleBtn.style.opacity = isPassword ? '1' : '0.5';
                });
            }
        }

        setupPasswordToggle('loginPassword', 'loginPasswordToggle');
        setupPasswordToggle('signupPassword', 'signupPasswordToggle');

        // Auth Form Switching
        document.getElementById('showSignup').addEventListener('click', () => {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });

        document.getElementById('showLogin').addEventListener('click', () => {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });

        // Login Form Handler
        document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');
            const errorText = document.getElementById('loginErrorText');
           
            // Hide any previous error
            errorDiv.classList.add('hidden');
           
            if (!email || !password) {
                // Show error for empty fields
                errorText.textContent = 'Please enter both email and password';
                errorDiv.classList.remove('hidden');
                return;
            }
           
            // Check if user is registered
            const registeredUsers = getRegisteredUsers();
            if (!registeredUsers[email]) {
                errorText.textContent = 'Email not registered. Please sign up first.';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            // Check password
            if (registeredUsers[email].password !== password) {
                errorText.textContent = 'Incorrect password';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            // Simple session-based login
            // Set current user
            currentUser = {
                name: registeredUsers[email].name,
                email: email,
                uid: 'user_' + Date.now()
            };
           
            // Store in localStorage for persistence
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
           
            // Clear error message on successful login
            errorDiv.classList.add('hidden');
           
            // Navigate to dashboard
            showDashboard();
        });

        // Signup Form Handler
        document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
           
            if (name && email && password) {
                // Check if user already exists
                const registeredUsers = getRegisteredUsers();
                if (registeredUsers[email]) {
                    alert('Email already registered. Please login or use a different email.');
                    return;
                }
                
                // Register the new user
                registeredUsers[email] = {
                    name: name,
                    password: password
                };
                saveRegisteredUsers(registeredUsers);
                
                // Simple session-based signup
                currentUser = {
                    name: name,
                    email: email,
                    uid: 'user_' + Date.now()
                };
               
                // Store in localStorage for persistence
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
               
                alert('Account created successfully! Welcome to EcoTrack! 🌱');
                showDashboard();
            }
        });

        // Google Auth Handlers (Placeholder - requires backend implementation)
        document.getElementById('googleLogin').addEventListener('click', async () => {
            alert('Google login will be implemented with a backend provider soon!');
        });

        document.getElementById('googleSignup').addEventListener('click', async () => {
            alert('Google signup will be implemented with a backend provider soon!');
        });

        // Show Dashboard
        function showDashboard() {
            authPage.classList.add('hidden');
            dashboardPage.classList.remove('hidden');
            document.getElementById('userName').textContent = currentUser.name;
        }

        // Logout Handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            dashboardPage.classList.add('hidden');
            authPage.classList.remove('hidden');
            // Reset forms
            document.getElementById('loginFormElement').reset();
            document.getElementById('signupFormElement').reset();
        });

        // Navigation Handlers
        const navButtons = ['navDashboard', 'navLogActivity', 'navTeams', 'navLeaderboard', 'navSettings'];
        navButtons.forEach(buttonId => {
            document.getElementById(buttonId).addEventListener('click', (e) => {
                // Update active nav
                navButtons.forEach(id => {
                    const btn = document.getElementById(id);
                    btn.classList.remove('text-green-600', 'border-b-2', 'border-green-600', 'pb-1');
                    btn.classList.add('text-gray-600');
                });
               
                e.target.classList.remove('text-gray-600');
                e.target.classList.add('text-green-600', 'border-b-2', 'border-green-600', 'pb-1');
               
                // Handle navigation
                if (buttonId === 'navLogActivity') {
                    showLogActivityModal();
                } else if (buttonId === 'navTeams') {
                    showTeamsSection();
                } else if (buttonId === 'navLeaderboard') {
                    showLeaderboardSection();
                } else if (buttonId === 'navSettings') {
                    showSettingsSection();
                } else if (buttonId === 'navDashboard') {
                    showDashboardSection();
                }
            });
        });

        // Show/Hide Sections
        function showTeamsSection() {
            hideAllSections();
            document.getElementById('teamsContent').classList.remove('hidden');
            currentView = 'teams';
        }

        function showLeaderboardSection() {
            hideAllSections();
            document.getElementById('leaderboardContent').classList.remove('hidden');
            currentView = 'leaderboard';
        }

        function showSettingsSection() {
            hideAllSections();
            document.getElementById('settingsContent').classList.remove('hidden');
            loadProfileData();
            currentView = 'settings';
        }

        function showDashboardSection() {
            hideAllSections();
            document.getElementById('dashboardContent').classList.remove('hidden');
            currentView = 'dashboard';
        }

        function hideAllSections() {
            document.getElementById('dashboardContent').classList.add('hidden');
            document.getElementById('teamsContent').classList.add('hidden');
            document.getElementById('leaderboardContent').classList.add('hidden');
            document.getElementById('settingsContent').classList.add('hidden');
        }

        // Modal Handlers
        function showLogActivityModal() {
            logActivityModal.classList.remove('hidden');
        }

        document.getElementById('closeModal').addEventListener('click', () => {
            logActivityModal.classList.add('hidden');
        });

        // Quick Action Handlers
        document.getElementById('quickLogActivity').addEventListener('click', showLogActivityModal);
       
        document.getElementById('quickViewTeam').addEventListener('click', showTeamsSection);
       
        document.getElementById('quickLeaderboard').addEventListener('click', showLeaderboardSection);
       
        document.getElementById('quickExport').addEventListener('click', () => {
            alert('Data export coming soon! 📊');
        });

        // Tab switching functionality
        document.getElementById('newActivityTab').addEventListener('click', () => {
            // Switch to new activity tab
            document.getElementById('newActivityTab').classList.add('bg-white', 'text-green-600', 'shadow-sm');
            document.getElementById('newActivityTab').classList.remove('text-gray-600');
            document.getElementById('previousActivityTab').classList.remove('bg-white', 'text-green-600', 'shadow-sm');
            document.getElementById('previousActivityTab').classList.add('text-gray-600');
           
            // Show/hide sections
            document.getElementById('newActivitySection').classList.remove('hidden');
            document.getElementById('previousActivitySection').classList.add('hidden');
        });

        document.getElementById('previousActivityTab').addEventListener('click', () => {
            // Switch to previous activities tab
            document.getElementById('previousActivityTab').classList.add('bg-white', 'text-green-600', 'shadow-sm');
            document.getElementById('previousActivityTab').classList.remove('text-gray-600');
            document.getElementById('newActivityTab').classList.remove('bg-white', 'text-green-600', 'shadow-sm');
            document.getElementById('newActivityTab').classList.add('text-gray-600');
           
            // Show/hide sections
            document.getElementById('previousActivitySection').classList.remove('hidden');
            document.getElementById('newActivitySection').classList.add('hidden');
        });

        // Previous activity selection
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                const amount = item.getAttribute('data-amount');
                const notes = item.getAttribute('data-notes');
               
                // Switch to new activity tab and populate form
                document.getElementById('newActivityTab').click();
               
                // Populate form with selected activity data
                document.getElementById('activityType').value = type;
                document.getElementById('activityAmount').value = amount;
                document.getElementById('activityNotes').value = notes;
               
                // Show confirmation
                const activityName = item.querySelector('.font-medium').textContent;
                if (confirm(`Log "${activityName}" activity again?\n\nYou can modify the details before submitting.`)) {
                    // Form is already populated, user can modify and submit
                } else {
                    // Clear form if user cancels
                    document.getElementById('activityForm').reset();
                }
            });
        });

        // Activity Form Handler (sends data to server endpoint)
        document.getElementById('activityForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const type = document.getElementById('activityType').value;
                    const amount = document.getElementById('activityAmount').value;
                    const notes = document.getElementById('activityNotes').value;

                    if (type && amount) {
                        // Calculate points based on activity type
                        let points = 25;
                        let co2Saved = 0.5;

                        switch(type) {
                            case 'cycling':
                                points = Math.floor(amount * 10);
                                co2Saved = amount * 0.23;
                                break;
                            case 'walking':
                                points = Math.floor(amount * 8);
                                co2Saved = amount * 0.18;
                                break;
                            case 'public-transport':
                                points = Math.floor(amount * 6);
                                co2Saved = amount * 0.15;
                                break;
                            case 'energy-saving':
                                points = 25;
                                co2Saved = 0.8;
                                break;
                            case 'recycling':
                                points = Math.floor(amount * 12);
                                co2Saved = amount * 0.2;
                                break;
                            case 'carpooling':
                                points = Math.floor(amount * 4);
                                co2Saved = amount * 0.14;
                                break;
                            case 'plant-based-meal':
                                points = 20;
                                co2Saved = 1.5;
                                break;
                            case 'water-saving':
                                points = Math.floor(amount * 0.3);
                                co2Saved = amount * 0.006;
                                break;
                        }

                        const payload = {
                            type,
                            amount: Number(amount),
                            notes,
                            points,
                            co2Saved: Number(co2Saved.toFixed(2)),
                            user: currentUser || null,
                            timestamp: new Date().toISOString()
                        };

                        // Try to POST to server; fall back gracefully if offline / server error
                        try {
                            const resp = await fetch('/api/activity', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });

                            if (resp.ok) {
                                const data = await resp.json();
                                alert(`Activity logged successfully! 🎉\n\nType: ${type.replace('-', ' ')}\nAmount: ${amount}\nCO₂ Saved: ${payload.co2Saved}kg\nPoints earned: +${points}`);
                            } else {
                                // Server returned error
                                alert(`Activity recorded locally (server error). It may not be saved remotely.`);
                            }
                        } catch (err) {
                            console.warn('Failed to reach server, saved locally:', err);
                            alert(`You're offline or the server is unavailable. Activity recorded locally.`);
                        }

                        logActivityModal.classList.add('hidden');
                        document.getElementById('activityForm').reset();
                        // Reset to new activity tab
                        document.getElementById('newActivityTab').click();
                    }
                });

        // Set Goal Handler
        document.getElementById('setGoalBtn').addEventListener('click', () => {
            alert('Goal set successfully! 🎯\n\nYou\'ll now track cycling to work twice a week. We\'ll remind you and celebrate your progress!');
        });

        // Close modal when clicking outside
        logActivityModal.addEventListener('click', (e) => {
            if (e.target === logActivityModal) {
                logActivityModal.classList.add('hidden');
            }
        });

        // Settings Functionality
       
        // Load current user data into profile form
        function loadProfileData() {
            if (currentUser) {
                document.getElementById('profileName').value = currentUser.name || '';
                document.getElementById('profileEmail').value = currentUser.email || '';
                document.getElementById('profileLocation').value = currentUser.location || '';
                document.getElementById('profileBio').value = currentUser.bio || '';
            }
        }

        // Profile Form Handler
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('profileName').value;
            const email = document.getElementById('profileEmail').value;
            const location = document.getElementById('profileLocation').value;
            const bio = document.getElementById('profileBio').value;
           
            if (name && email) {
                // Update current user data
                currentUser.name = name;
                currentUser.email = email;
                currentUser.location = location;
                currentUser.bio = bio;
               
                // Update display name in header
                document.getElementById('userName').textContent = name;
               
                alert('Profile updated successfully! 🎉');
            }
        });

        // Mobile Hamburger Menu Functionality
        const mobileHamburgerMenu = document.getElementById('mobileHamburgerMenu');
        const mobileNavMenu = document.getElementById('mobileNavMenu');
        const hamburgerLine1 = document.getElementById('hamburgerLine1');
        const hamburgerLine2 = document.getElementById('hamburgerLine2');
        const hamburgerLine3 = document.getElementById('hamburgerLine3');
       
        let mobileMenuOpen = false;
       
        mobileHamburgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuOpen = !mobileMenuOpen;
           
            if (mobileMenuOpen) {
                // Show menu
                mobileNavMenu.classList.remove('hidden');
               
                // Animate hamburger to X
                hamburgerLine1.style.transform = 'rotate(45deg) translate(4px, 4px)';
                hamburgerLine2.style.opacity = '0';
                hamburgerLine3.style.transform = 'rotate(-45deg) translate(4px, -4px)';
            } else {
                // Hide menu
                mobileNavMenu.classList.add('hidden');
               
                // Animate X back to hamburger
                hamburgerLine1.style.transform = 'rotate(0) translate(0, 0)';
                hamburgerLine2.style.opacity = '1';
                hamburgerLine3.style.transform = 'rotate(0) translate(0, 0)';
            }
        });
       
        // Close mobile menu when clicking outside
        document.addEventListener('click', () => {
            if (mobileMenuOpen) {
                mobileNavMenu.classList.add('hidden');
                mobileMenuOpen = false;
               
                // Reset hamburger animation
                hamburgerLine1.style.transform = 'rotate(0) translate(0, 0)';
                hamburgerLine2.style.opacity = '1';
                hamburgerLine3.style.transform = 'rotate(0) translate(0, 0)';
            }
        });
       
        // Mobile navigation handlers
        document.getElementById('mobileNavDashboard').addEventListener('click', () => {
            closeMobileMenu();
            showDashboardSection();
            updateMobileActiveNav('mobileNavDashboard');
        });
       
        document.getElementById('mobileNavLogActivity').addEventListener('click', () => {
            closeMobileMenu();
            showLogActivityModal();
        });
       
        document.getElementById('mobileNavTeams').addEventListener('click', () => {
            closeMobileMenu();
            showTeamsSection();
            updateMobileActiveNav('mobileNavTeams');
        });
       
        document.getElementById('mobileNavLeaderboard').addEventListener('click', () => {
            closeMobileMenu();
            showLeaderboardSection();
            updateMobileActiveNav('mobileNavLeaderboard');
        });
       
        document.getElementById('mobileNavSettings').addEventListener('click', () => {
            closeMobileMenu();
            showSettingsSection();
            updateMobileActiveNav('mobileNavSettings');
        });
       
        // Helper function to close mobile menu
        function closeMobileMenu() {
            mobileNavMenu.classList.add('hidden');
            mobileMenuOpen = false;
           
            // Reset hamburger animation
            hamburgerLine1.style.transform = 'rotate(0) translate(0, 0)';
            hamburgerLine2.style.opacity = '1';
            hamburgerLine3.style.transform = 'rotate(0) translate(0, 0)';
        }
       
        // Helper function to update mobile active navigation state
        function updateMobileActiveNav(activeId) {
            const mobileNavButtons = ['mobileNavDashboard', 'mobileNavTeams', 'mobileNavLeaderboard', 'mobileNavSettings'];
            mobileNavButtons.forEach(id => {
                const btn = document.getElementById(id);
                btn.classList.remove('text-green-600', 'bg-green-50');
                btn.classList.add('text-gray-700');
            });
           
            if (activeId !== 'mobileNavLogActivity') {
                const activeBtn = document.getElementById(activeId);
                activeBtn.classList.remove('text-gray-700');
                activeBtn.classList.add('text-green-600', 'bg-green-50');
            }
        }
       
        // Helper function to update active navigation state
        function updateActiveNav(activeId) {
            const navButtons = ['navDashboard', 'navLogActivity', 'navTeams', 'navLeaderboard', 'navSettings'];
            navButtons.forEach(id => {
                const btn = document.getElementById(id);
                btn.classList.remove('text-green-600', 'border-b-2', 'border-green-600', 'pb-1');
                btn.classList.add('text-gray-600');
            });
           
            if (activeId !== 'navLogActivity') {
                const activeBtn = document.getElementById(activeId);
                activeBtn.classList.remove('text-gray-600');
                activeBtn.classList.add('text-green-600', 'border-b-2', 'border-green-600', 'pb-1');
            }
        }

        // Settings Button Handlers
        document.getElementById('changePasswordBtn').addEventListener('click', () => {
            alert('Password change functionality coming soon! 🔑\n\nFor now, you can reset your password through the login page.');
        });

        document.getElementById('exportDataBtn').addEventListener('click', () => {
            // Generate monthly emissions heatmap data
            const monthlyEmissions = {};
            const currentDate = new Date();
           
            // Generate 12 months of sample data
            for (let i = 11; i >= 0; i--) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
               
                // Simulate varying emissions (lower is better)
                const baseEmission = Math.random() * 50 + 20; // 20-70 kg CO2
                const savedEmission = Math.random() * 30 + 10; // 10-40 kg CO2 saved
               
                monthlyEmissions[monthKey] = {
                    totalEmissions: Math.round(baseEmission * 100) / 100,
                    savedEmissions: Math.round(savedEmission * 100) / 100,
                    netEmissions: Math.round((baseEmission - savedEmission) * 100) / 100,
                    activities: Math.floor(Math.random() * 25) + 5, // 5-30 activities
                    streakImpact: Math.random() > 0.7 ? -1 : 0 // 30% chance of streak reduction
                };
            }
           
            // Simulate data export with heatmap
            const exportData = {
                user: currentUser,
                currentStreak: 7,
                activities: [
                    { type: 'cycling', distance: '5.2 km', co2Saved: '1.2 kg', points: 50, date: new Date().toISOString() },
                    { type: 'public-transport', distance: '12 km', co2Saved: '2.8 kg', points: 75, date: new Date().toISOString() },
                    { type: 'energy-saving', amount: 'LED bulbs', co2Saved: '0.8 kg', points: 25, date: new Date().toISOString() }
                ],
                totalPoints: 1250,
                totalCO2Saved: '24.5 kg',
                monthlyEmissionsHeatmap: monthlyEmissions,
                streakHistory: {
                    longestStreak: 14,
                    currentStreak: 7,
                    streakBreaks: 3,
                    note: "Streak reduces by 1 day when monthly emissions exceed personal target"
                }
            };
           
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
           
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ecotrack-data-with-heatmap.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
           
            alert('Your eco data with monthly emissions heatmap has been exported! 📊🔥\n\nIncludes: 12-month emissions heatmap, streak tracking, and detailed activity breakdown.');
        });

        document.getElementById('settingsLogoutBtn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to logout? 🚪')) {
                currentUser = null;
                localStorage.removeItem('currentUser');
                dashboardPage.classList.add('hidden');
                authPage.classList.remove('hidden');
                // Reset forms
                document.getElementById('loginFormElement').reset();
                document.getElementById('signupFormElement').reset();
                document.getElementById('profileForm').reset();
            }
        });

        // === CHECK STORED SESSION ON PAGE LOAD ===
        window.addEventListener('load', () => {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                try {
                    currentUser = JSON.parse(storedUser);
                    showDashboard();
                } catch (e) {
                    // Invalid stored user, show login
                    dashboardPage.classList.add('hidden');
                    authPage.classList.remove('hidden');
                }
            } else {
                // No stored user, show login
                dashboardPage.classList.add('hidden');
                authPage.classList.remove('hidden');
            }
        }, { once: true });

        // Team invitation functionality
        document.getElementById('sendInviteBtn').addEventListener('click', () => {
            const email = document.getElementById('inviteEmail').value;
            const message = document.getElementById('inviteMessage').value;
           
            if (email) {
                alert(`Invitation sent to ${email}! 📧\n\nThey'll receive an email with your personal message and a link to join "Green Warriors Squad".`);
                document.getElementById('inviteEmail').value = '';
                document.getElementById('inviteMessage').value = '';
            } else {
                alert('Please enter an email address to send the invitation.');
            }
        });

        // Streak management
        let currentStreak = 7;
        let monthlyEmissions = 0;
        const emissionTarget = 50; // kg CO2 per month

        function updateStreak() {
            document.getElementById('streakCounter').textContent = `🔥 ${currentStreak}`;
        }

        function checkEmissionImpact(newEmission) {
            monthlyEmissions += newEmission;
            if (monthlyEmissions > emissionTarget) {
                currentStreak = Math.max(0, currentStreak - 1);
                updateStreak();
                alert(`⚠️ Monthly emission target exceeded! Your streak has been reduced to ${currentStreak} days. Keep up the eco-friendly activities to rebuild it! 🌱`);
            }
        }

        // Load profile data when settings section is shown
        function showSettingsSection() {
            hideAllSections();
            document.getElementById('settingsContent').classList.remove('hidden');
            loadProfileData();
        }
        // ...existing code...
document.addEventListener('DOMContentLoaded', () => {
    // --- GPS TRACKER FOR AUTOMATIC MODE DETECTION ---
    const startGpsBtn = document.createElement('button');
    startGpsBtn.id = 'startGpsBtn';
    startGpsBtn.type = 'button';
    startGpsBtn.textContent = 'Start GPS';
    startGpsBtn.className = 'mt-2 px-3 py-2 bg-green-500 text-white rounded-lg';

    const stopGpsBtn = document.createElement('button');
    stopGpsBtn.id = 'stopGpsBtn';
    stopGpsBtn.type = 'button';
    stopGpsBtn.textContent = 'Stop GPS';
    stopGpsBtn.className = 'hidden mt-2 ml-2 px-3 py-2 bg-red-500 text-white rounded-lg';

    const gpsStatus = document.createElement('div');
    gpsStatus.id = 'gpsStatus';
    gpsStatus.className = 'text-sm text-gray-600 mt-2';
    gpsStatus.textContent = '';

    // Insert controls into Log Activity modal header area (below tabs)
    const newActivitySection = document.getElementById('newActivitySection');
    if (newActivitySection) {
        const ctrlWrap = document.createElement('div');
        ctrlWrap.className = 'flex items-center';
        ctrlWrap.appendChild(startGpsBtn);
        ctrlWrap.appendChild(stopGpsBtn);
        ctrlWrap.appendChild(gpsStatus);
        newActivitySection.insertBefore(ctrlWrap, newActivitySection.firstChild);
    }

    let watchId = null;
    let positions = []; // {lat, lon, t}
    let totalDistanceKm = 0;

    function haversineKm(a, b) {
        const R = 6371; // km
        const toRad = v => v * Math.PI / 180;
        const dLat = toRad(b.lat - a.lat);
        const dLon = toRad(b.lon - a.lon);
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);
        const sinDlat = Math.sin(dLat/2);
        const sinDlon = Math.sin(dLon/2);
        const c = 2 * Math.asin(Math.sqrt(sinDlat*sinDlat + Math.cos(lat1)*Math.cos(lat2)*sinDlon*sinDlon));
        return R * c;
    }

    function classifyMode(avgKmh) {
        // Tunable thresholds
        if (avgKmh < 6) return { type: 'walking', label: 'Walking' };            // <6 km/h
        if (avgKmh < 25) return { type: 'cycling', label: 'Cycling' };           // 6-25 km/h
        return { type: 'carpooling', label: 'Vehicle' };                         // >25 km/h
    }

    function updateGpsStatus() {
        const statusEl = document.getElementById('gpsStatus');
        if (!statusEl) return;
        if (positions.length < 2) {
            statusEl.textContent = 'Waiting for GPS fixes...';
            return;
        }
        // compute avg speed (km/h) over segments
        let totalTimeHours = 0;
        let totalDist = 0;
        for (let i = 1; i < positions.length; i++) {
            const p0 = positions[i-1], p1 = positions[i];
            const dt = (p1.t - p0.t) / 3600000; // hours
            if (dt <= 0) continue;
            const d = haversineKm(p0, p1);
            totalDist += d;
            totalTimeHours += dt;
        }
        const avgKmh = totalTimeHours > 0 ? (totalDist / totalTimeHours) : 0;
        totalDistanceKm = totalDist;
        const mode = classifyMode(avgKmh);
        statusEl.textContent = `Distance ${totalDistanceKm.toFixed(2)} km • avg ${avgKmh.toFixed(1)} km/h • detected: ${mode.label}`;
        // fill form fields
        const activityType = document.getElementById('activityType');
        const activityAmount = document.getElementById('activityAmount');
        if (activityType && activityAmount) {
            activityType.value = mode.type;
            activityAmount.value = totalDistanceKm.toFixed(1);
        }
    }

    function onPosition(pos) {
        const coords = pos.coords;
        const item = { lat: coords.latitude, lon: coords.longitude, t: pos.timestamp };
        if (positions.length > 0) {
            const prev = positions[positions.length - 1];
            const seg = haversineKm(prev, item);
            totalDistanceKm += seg;
        }
        positions.push(item);
        updateGpsStatus();
    }

    function onError(err) {
        gpsStatus.textContent = 'GPS error: ' + (err && err.message ? err.message : err);
        console.error('GPS error', err);
        stopTracking();
    }

    function startTracking() {
        if (!('geolocation' in navigator)) {
            gpsStatus.textContent = 'Geolocation not available in this browser.';
            return;
        }
        positions = [];
        totalDistanceKm = 0;
        gpsStatus.textContent = 'Requesting permission...';
        // highAccuracy for better detection; interval controlled by device/browser
        watchId = navigator.geolocation.watchPosition(onPosition, onError, {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
        });
        startGpsBtn.classList.add('hidden');
        stopGpsBtn.classList.remove('hidden');
    }

    function stopTracking() {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
        // final classification and fill
        if (positions.length >= 2) {
            // compute final avg speed
            let totalTimeHours = 0;
            let totalDist = 0;
            for (let i = 1; i < positions.length; i++) {
                const p0 = positions[i-1], p1 = positions[i];
                const dt = (p1.t - p0.t) / 3600000; // hours
                if (dt <= 0) continue;
                const d = haversineKm(p0, p1);
                totalDist += d;
                totalTimeHours += dt;
            }
            const avgKmh = totalTimeHours > 0 ? (totalDist / totalTimeHours) : 0;
            const mode = classifyMode(avgKmh);
            gpsStatus.textContent = `Stopped • ${totalDist.toFixed(2)} km • avg ${avgKmh.toFixed(1)} km/h • ${mode.label}`;
            // populate form (again) and optionally auto-submit
            const activityType = document.getElementById('activityType');
            const activityAmount = document.getElementById('activityAmount');
            const activityNotes = document.getElementById('activityNotes');
            if (activityType) activityType.value = mode.type;
            if (activityAmount) activityAmount.value = totalDist.toFixed(1);
            if (activityNotes) activityNotes.value = (activityNotes.value ? activityNotes.value + '\n' : '') + `GPS-tracked ${mode.label} ${totalDist.toFixed(1)} km`;
        } else {
            gpsStatus.textContent = 'Tracking stopped — not enough GPS data.';
        }

        startGpsBtn.classList.remove('hidden');
        stopGpsBtn.classList.add('hidden');
    }

    startGpsBtn.addEventListener('click', () => {
        startTracking();
    });

    stopGpsBtn.addEventListener('click', () => {
        stopTracking();
    });

    // Optional: stop tracking when modal closes
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            stopTracking();
        });
    }

    // Ensure tracking stops if user navigates away
    window.addEventListener('beforeunload', () => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    });
});
// ...existing code...