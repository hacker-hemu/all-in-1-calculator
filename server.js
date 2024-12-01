const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

// Initialize Express app
const app = express();
// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
    session({
        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true,
    })
);

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'all_in_one_calculator',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Middleware to redirect logged-in users
function redirectIfLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect('/index.html'); // Redirect to homepage if logged in
    }
    next();
}

// Middleware to ensure authentication for protected routes
function ensureAuthenticated(req, res, next) {
    if (!req.session.user) {
         return res.redirect('/login'); // Redirect to login if not authenticated
     }
    next();
}
// Register route
app.post('/register', async (req, res) => {
    const { username, email, mobile, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) return res.status(500).send('Database error');
            if (results.length > 0) {
                // res.send('Incorrect password');
                return res.write(`
                    <html>
                        <body>
                            <script>
                                alert('Username Aready Registered!');
                                window.location.href = '/'; 
                            </script>
                        </body>
                    </html>
                `);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                'INSERT INTO users (username, email, mobile, password) VALUES (?, ?, ?, ?)',
                [username, email, mobile, hashedPassword],
                (err) => {
                    if (err) return res.status(500).send('Database error');
                    // req.session.user = { username, email };
                    res.write(`
                        <html>
                            <body>
                                <script>
                                    alert('User Registration Successful!');
                                    window.location.href = '/'; 
                                </script>
                            </body>
                        </html>
                    `);
                    // res.redirect('/index.html');
                }
            );
        }
    );
});


// Register route
app.post('/news-letter', async (req, res) => {
    const { email } = req.body;

    db.query(
        'SELECT * FROM news_letters WHERE email = ?',
        [email],
        async (err, results) => {
            if (err) return res.status(500).send('Database error');
            if (results.length > 0){ 
                return res.write(`
                    <html>
                        <body>
                            <script>
                                alert('Email Alredy Subscribed');
                                window.location.href = '/'; 
                            </script>
                        </body>
                    </html>
                `);
            }
            db.query(
                'INSERT INTO news_letters (email) VALUES (?)',
                [email],
                (err) => {
                    if (err) return res.status(500).send('Database error');
                    req.session.user = { email };
                    // res.redirect('/index.html');
                    res.write(`
                        <html>
                            <body>
                                <script>
                                    alert('Thanks for subscribing');
                                    window.location.href = '/'; 
                                </script>
                            </body>
                        </html>
                    `);
                }
            );
        }
    );
});


// Contact route
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    db.query(
        'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        (err) => {
            if (err) return res.status(500).send('Database error');
            req.session.user = { email };
            // res.redirect('/');
            res.write(`
                <html>
                    <body>
                        <script>
                            alert('Thanks for conacting us');
                            window.location.href = '/'; 
                        </script>
                    </body>
                </html>
            `);
        }
    );
});


// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) return res.status(500).send('Database error');
            // if (results.length === 0) return res.send('User not found');

            if (results.length === 0) {
                // res.send('Incorrect password');
                return res.write(`
                    <html>
                        <body>
                            <script>
                                alert('User Not Found!');
                                window.location.href = '/'; 
                            </script>
                        </body>
                    </html>
                `);
            }

            const user = results[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.user = user;
                res.redirect('/index.html');
            } else {
                // res.send('Incorrect password');
                res.write(`
                    <html>
                        <body>
                            <script>
                                alert('Password is Invalid!');
                                window.location.href = '/'; // Redirect to the index.html page
                            </script>
                        </body>
                    </html>
                `);
            }
        }
    );
});


// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Serve HTML pages with middleware checks
/*app.get('/login', redirectIfLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/login.html');
});*/

app.get('/register', redirectIfLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.get('/index.html', ensureAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/news-letter', ensureAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/public/news-letter.html');
});


app.get('/contact', ensureAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/public/contact.html');
});


// API route for user data
app.get('/api/user', (req, res) => {
    if (!req.session.user) return res.status(401).json({ username: null });
    res.json({ username: req.session.user.username });
});


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/', express.static(path.join(__dirname, '/')));
// Route for main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/scientific', (req, res) => {
    res.render('scientific');  // Renders views/index.ejs
});
// geometryyy...

// Middleware to parse the body of POST requests (for form data)
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 2D Distance Calculator
app.post('/calculate-2d-distance', (req, res) => {
    const { x1, y1, x2, y2 } = req.body;
    console.log("Received data:", req.body);
    
    // Validate the inputs
    if (!x1 || !y1 || !x2 || !y2) {
        return res.status(400).json({ error: "Missing coordinates" });
    }

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return res.json({ distance2D: distance });
});

// 3D Distance Calculator
app.post('/calculate-3d-distance', (req, res) => {
    const { 'x1-3d': x1, 'y1-3d': y1, 'z1-3d': z1, 'x2-3d': x2, 'y2-3d': y2, 'z2-3d': z2 } = req.body;

    if (!x1 || !y1 || !z1 || !x2 || !y2 || !z2) {
        return res.status(400).json({ error: 'All inputs are required' });
    }

    try {
        const distance3D = Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2) +
            Math.pow(z2 - z1, 2)
        );
        res.json({ distance3D });
    } catch (err) {
        console.error('Error calculating 3D distance:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Equilateral Triangle Calculator
app.post('/calculate-equilateral-triangle', (req, res) => {
    const { side } = req.body;
    
    if (!side) {
        return res.status(400).json({ error: "Missing side length" });
    }

    const area = (Math.sqrt(3) / 4) * Math.pow(side, 2);
    return res.json({ area: area });
});

// Isosceles Triangle Calculator
app.post('/calculate-isosceles', (req, res) => {
    const { base, sideLength } = req.body;
    console.log("Base:", base, "Side Length:", sideLength); // Log these values to debug

    if (!base || !sideLength) {
        return res.status(400).json({ error: 'Both base and side length are required.' });
    }

    const b = parseFloat(base);
    const s = parseFloat(sideLength);

    if (b <= 0 || s <= 0) {
        return res.status(400).json({ error: 'Base and side length must be positive numbers.' });
    }

    const height = Math.sqrt(s ** 2 - (b / 2) ** 2);
    const area = (b * height) / 2;
    const perimeter = 2 * s + b;

    res.json({ areaIsosceles: area.toFixed(2), perimeterIsosceles: perimeter.toFixed(2) });
});


// Right-Angled Triangle Calculator
app.post('/calculate-right-angled-triangle', (req, res) => {
    const { base, height } = req.body;

    if (!base || !height) {
        return res.status(400).json({ error: "Missing base or height" });
    }

    // Convert inputs to numbers
    const b = parseFloat(base);
    const h = parseFloat(height);

    // Check for valid positive numbers
    if (b <= 0 || h <= 0) {
        return res.status(400).json({ error: "Base and height must be positive numbers" });
    }

    // Calculate hypotenuse using Pythagoras theorem
    const hypotenuse = Math.sqrt(Math.pow(b, 2) + Math.pow(h, 2));

    // Calculate area of the triangle
    const area = 0.5 * b * h;

    // Send both hypotenuse and area in the response
    return res.json({ hypotenuse: hypotenuse.toFixed(2), area: area.toFixed(2) });
});

// Cube Calculator
app.post('/calculate-cube', (req, res) => {
    const { side } = req.body;
    
    if (!side) {
        return res.status(400).json({ error: "Missing side length" });
    }

    const volume = Math.pow(side, 3);
    return res.json({ volume: volume });
});

// Cone Calculator
app.post('/calculate-cone', (req, res) => {
    const { radius, height } = req.body;
    
    if (!radius || !height) {
        return res.status(400).json({ error: "Missing radius or height" });
    }

    const volume = (1 / 3) * Math.PI * Math.pow(radius, 2) * height;
    return res.json({ volume: volume });
});

// Circle Calculator
app.post('/calculate-circle', (req, res) => {
    const { radius } = req.body;
    
    if (!radius) {
        return res.status(400).json({ error: "Missing radius" });
    }

    const area = Math.PI * Math.pow(radius, 2);
    return res.json({ area: area });
});

// Cylinder Calculator
app.post('/calculate-cylinder', (req, res) => {
    const { radius, height } = req.body;
    
    if (!radius || !height) {
        return res.status(400).json({ error: "Missing radius or height" });
    }

    const volume = Math.PI * Math.pow(radius, 2) * height;
    return res.json({ volume: volume });
});

// Rectangle Calculator
app.post('/calculate-rectangle', (req, res) => {
    const { length, width } = req.body;
    
    if (!length || !width) {
        return res.status(400).json({ error: "Missing length or width" });
    }

    const area = length * width;
    return res.json({ area: area });
});

// Square Calculator
app.post('/calculate-square', (req, res) => {
    const { side } = req.body;
    
    if (!side) {
        return res.status(400).json({ error: "Missing side length" });
    }

    const area = Math.pow(side, 2);
    return res.json({ area: area });
});

// Sphere Calculator
app.post('/calculate-sphere', (req, res) => {
    const { radius } = req.body;
    
    if (!radius) {
        return res.status(400).json({ error: "Missing radius" });
    }

    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    return res.json({ volume: volume });
});

// Serve the EJS template file
app.get('/geometry', (req, res) => {
    res.render('geometry'); // This will render index.ejs from the 'views' folder
});


//financial..
// Import routes
const simpleInterestRoutes = require('./routes/simpleInterest');
const compoundInterestRoutes = require('./routes/compoudInterest');
const currencyConversionRoutes = require('./routes/currencyConvertet');
const salaryCalculationRoutes = require('./routes/salaryCalculation');
const retirementCalculationRoutes = require('./routes/retirenmentCalculation');
const investmentCalculationRoutes = require('./routes/invesmentCalculation');

// Register API routes
app.use('/api', simpleInterestRoutes);
app.use('/api', compoundInterestRoutes);
app.use('/api', currencyConversionRoutes);
app.use('/api', salaryCalculationRoutes);
app.use('/api', retirementCalculationRoutes);
app.use('/api', investmentCalculationRoutes);

app.get('/financial', (req, res) => {
    res.render('financial', { title: 'Comprehensive Financial Calculator' });
});

app.get('/conversion', (req, res) => {
    res.render('conversion', { title: 'conversion calcultor' });
});


app.get('/health', (req, res) => {
    res.render('health', { title: 'health calculator' });
});

app.get('/algebra', (req, res) => {
    res.render('algebra');
});
// Start the server and automatically open the browser
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);

    // Use dynamic import for open module (ESM)
    const open = await import('open');
    open.default(`http://localhost:${PORT}`);  // Open the browser at the specified URL
});
