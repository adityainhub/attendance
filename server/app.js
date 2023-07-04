const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql2")
const bcrypt = require("bcryptjs")

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createPool({
     host: "mysql-121145-0.cloudclusters.net",
    user: "admin",
    port:"19854",
    password: "10yMFplL",
    database: "attendance"
})
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database with ID ' + connection.threadId);
});

//inser status
app.post("/insertstatus/:id/:attdate/:proj_id", (req, res) => {
    const id = req.params.id
    const intconvert = parseInt(id)
    const attdate = req.params.attdate;
    const proj_id = req.params.proj_id
    const projidconvert = parseInt(proj_id)

    const { attstatus, attvalue, Time_In, Time_out } = req.body
    const attvalueconvert = parseInt(attvalue)

    const addmemberdata = `insert into atte (proj_id,PM_id,attdate,attstatus,attvalue,Time_In,Time_out) values (?,?,?,?,?,?,?);`;
    db.query(addmemberdata, [projidconvert, intconvert, attdate, attstatus, attvalueconvert, Time_In, Time_out], (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }

    })
})



//admin register
// app.post('/adminregister', (req, res) => {
//     const { email, password } = req.body
//     const insertdata = "INSERT INTO admin(email,password) VALUES (?,?)";
//     db.query(insertdata, [email, password], (err, doc) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(doc);
//         }
//     });
// });



app.post('/adminregister', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [existingUser] = await connection.execute('SELECT * FROM admin WHERE email = ?', [email]);
        if (existingUser.length) {
            return res.status(409).send({ message: 'Email already registered' });
        }
        // Hash the password before inserting into the database
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('INSERT INTO admin (email, password) VALUES (?, ?)', [email, hashedPassword]);
        return res.status(201).send({ message: 'User created' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server error' });
    }
});


//admin login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query(
        "SELECT * FROM admin WHERE email = ? AND password = ?",
        [email, password],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: "Internal Server Error" });
            } else if (results.length === 0) {
                res.status(401).json({ error: "Invalid Credentials" });
            } else {
                // Save the user's information in the session
                //   req.session.user = results[0];
                res.json({ message: "Successfully logged in" });
            }
        }
    );
});



app.post("/testing", async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            throw new Error("password is required in the request body");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        res.json({ message: hashedPassword });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
});


app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists and if the password is correct
        const [user] = await db.promise().query("SELECT * FROM admin WHERE email = ?", [email]);
        if (user && (password == user.password)) {
            // Create the JWT
            const payload = { id: user.id };
            const secret = process.env.JWT_SECRET;
            const options = { expiresIn: "1h" };
            const token = jwt.sign(payload, secret, options);
            // Send the token to the client
            res.json({ token });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//get all project list
app.get("/alldata", (req, res) => {
    const getalldata = "SELECT * FROM projects ";
    db.query(getalldata, (err, result) => {
        console.log(err);
        res.send(result)

    })
})


//fetch members according to projects
app.get("/getmembers/:id", (req, res) => {
    const id = req.params.id
    const fetchmembers = `select  projects.project_id, projects.projectName, projectmember.member, projectmember.PM_id from projects inner join projectmember on projects.project_id=projectmember.project_id where projects.project_id=${id};`;
    db.query(fetchmembers, (err, doc) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json(doc)

        }
    })
})

app.get("/tovalidatethemember/:pmid/:attdate", (req, res) => {
    const id = req.params.pmid
    const attdate = req.params.attdate
    const fetchmembers = `select * from atte where PM_id=${id} and attdate = '${attdate}';`;
    db.query(fetchmembers, (err, doc) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json(doc)

        }
    })
})

app.get("/getstatusmember/:attdate/:id", (req, res) => {

    const attdate = req.params.attdate
    const id = req.params.id

    const getstatus = `
    SELECT pm.member, a.attstatus,a.Time_In
    FROM atte a 
    JOIN projectmember pm ON a.PM_id = pm.PM_id 
    WHERE a.attdate = '${attdate}'
    AND a.proj_id = ${id} order by pm.member;`
    db.query(getstatus, (err, doc) => {
        if (err) {
            res.send(err)
        } else {
            res.json(doc)

        }
    })
})




//markallpresent---------------------------------------------
app.post("/markallpresent/:role_id/:project_id/:formattedToday", (req, res) => {
    const { role_id, project_id, formattedToday } = req.params;
    const markallpresent = `
    INSERT INTO \`attendance\`.\`atte\` (\`proj_id\`, \`PM_id\`, \`attdate\`, \`attstatus\`, \`attvalue\`, \`Time_In\`, \`Time_out\`) 
    SELECT \`project_id\`, \`PM_id\`, '${formattedToday}', 'Present', 1, '08:30', '17:00' 
    FROM \`attendance\`.\`projectmember\` WHERE \`project_id\` = ${project_id} and \`role_id\` = ${role_id};
    `;
    

    db.query(markallpresent, [formattedToday,project_id,role_id], (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});




app.get("/getmembers/:id", (req, res) => {
    const id = req.params.id
    const fetchmembers = `select  projects.project_id, projects.projectName, projectmember.member, projectmember.PM_id from projects inner join projectmember on projects.project_id=projectmember.project_id where projects.project_id=${id};`;
    db.query(fetchmembers, (err, doc) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json(doc)

        }
    })
})

app.get("/getrolename/:role_id", (req, res) => {
    const role_id = req.params.role_id
    const fetchmembers = `select role_name from roles where role_id = ${role_id};`;
    db.query(fetchmembers, (err, doc) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json(doc)

        }
    })
})



app.get("/downloadreport1/:id", (req, res) => {
    const id = req.params.id;
  //  const role_id = req.params.role_id;
    

    const getalldata = `
    select projectmember.member as Name,atte.attdate as Date,
    atte.attstatus as Status, atte.Time_In ,atte.Time_out ,
    ROUND(TIMESTAMPDIFF(
                            MINUTE, 
                            STR_TO_DATE(atte.Time_In,'%H:%i'),
                            STR_TO_DATE(atte.Time_out,'%H:%i')
                           )/60,2) as Working_Hours,
                           (SELECT roles.role_name 
     FROM roles 
     WHERE project_id=${id} and roles.role_id = projectmember.role_id LIMIT 1)
	as Role_name
    from projectmember 
    inner join atte
     on atte.PM_id=projectmember.PM_id where proj_id=${id} 
     order by STR_TO_DATE(atte.attdate,"%DD-%MM-%YYYY"),Role_id`;
       db.query(getalldata, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error retrieving data");
        } else {
            if (result.length === 0) {
                res.status(404).send("No data found");
            } else {
                res.send(result);
            }
        }
    });
});



//to get all the details of particular member
app.get("/getmemberdetail/:id", (req, res) => {
    const id = req.params.id
    const data = `select p.member,a.atte_id,a.proj_id,a.PM_id,a.attdate,a.attstatus,a.attvalue,a.Time_In,a.Time_out from atte a inner join projectmember p on p.PM_id=a.PM_id where p.PM_id=${id};`
    db.query(data, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);

        }

    })
})


//function for storing the PM_id
app.get("/fetchfuncforpmid/:id", (req, res) => {
    const id = req.params.id
    const data = `select * from projectmember where PM_id = ${id};`
    db.query(data, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc)
        }
    })
})

app.get("/getabsentdays/:id", (req, res) => {
    const id = req.params.id
    const data = `SELECT COUNT(*) FROM atte WHERE attvalue = 0 and PM_id=${id};`
    db.query(data, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc)
        }
    })
})




//todownloadreport-----------


app.get("/downloadreport/:id/:role_id", (req, res) => {
    const id = req.params.id;
    const role_id =req.params.role_id

    const getalldata = `
    SELECT 
    projectmember.member AS Name,
    atte.attdate AS Date,
    atte.attstatus AS Status,
    atte.Time_In,
    atte.Time_out,
    TIMESTAMPDIFF(
        MINUTE, 
        STR_TO_DATE(atte.Time_In,'%H:%i'),
        STR_TO_DATE(atte.Time_out,'%H:%i')
       )/60 as Working_Hours,
    (SELECT roles.role_name 
     FROM roles 
     WHERE roles.role_id = ${role_id} AND roles.project_id = ${id}
     LIMIT 1) AS role_name
FROM 
    projectmember
INNER JOIN 
    atte ON atte.PM_id = projectmember.PM_id
WHERE 
    proj_id = ${id} AND role_id = ${role_id}
ORDER BY 
    atte.attdate, atte.PM_id;

    `;
    db.query(getalldata, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error retrieving data");
        } else {
            if (result.length === 0) {
                res.status(404).send("No data found");
            } else {
                res.send(result);
            }
        }
    });
});




//to change status from present to absent
app.put("/changestatus/:id/:dateone", (req, res) => {
    const id = req.params.id
    const attdate = req.params.dateone;

    const [day, month, year] = attdate.split("-");
    const newDateString = `${day}/${month}/${year}`;


    const changestatus =
        `update atte set attstatus=case attstatus
when "Present" then "Absent"
else "Present"
end,
attvalue=case attvalue
when 0 then 1
else 0
end
WHERE PM_id = ${id} AND attdate = '${attdate}';`;

    db.query(changestatus, (err, doc1) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json(doc1)
                ;
        }
    })
})


//Mark the absent or present or timein and timeout --------------------------------------
app.post("/addmembers/:id/:attdate/:proj_id", (req, res) => {
    const id = req.params.id
    const intconvert = parseInt(id)
    const attdate = req.params.attdate;
    const proj_id = req.params.proj_id
    const projidconvert = parseInt(proj_id)

    const { attstatus, attvalue, timein, timeout } = req.body
    const attvalueconvert = parseInt(attvalue)

    // console.log(id);
    // console.log(intconvert);
    // console.log(attdate);
    // console.log(projidconvert);
    // console.log(attstatus);
    // console.log(attvalueconvert);
    // console.log(timein);
    // console.log(timeout);

    const addmemberdata = `insert into atte (proj_id,PM_id,attdate,attstatus,attvalue,Time_In,Time_out) values (?,?,?,?,?,?,?);`;
    db.query(addmemberdata, [projidconvert, intconvert, attdate, attstatus, attvalueconvert, timein, timeout], (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }

    })
})
// dkh rha?

app.post("/addatte/:id", (req, res) => {

    const ida = req.params.id
    const { proj_id, attdate, attstatus, attvalue } = req.body
    const addmemberdata = "INSERT INTO atte (proj_id,PM_id,attdate,attstatus,attvalue) VALUES (?,?,?,?,?)";
    db.query(addmemberdata, [proj_id, ida, attdate, attstatus, attvalue], (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }

    })
})



//
app.get("/getattendance/:id", (req, res) => {
    const id = req.params.id
    const fetchattendance = `select atte.Time_In, atte.Time_out,  atte.PM_id ,atte.atte_id , atte.attdate, atte.attstatus,projectmember.member from atte inner join projectmember on atte.PM_id=projectmember.PM_id where atte.PM_id=${id} order by atte.atte_id desc limit 7 ;`;
    db.query(fetchattendance, (err, doc) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json(doc)
        }
    })
})

//insert projects
app.post('/insertproject', (req, res) => {

    const { projectName } = req.body
    const insertdata = "INSERT INTO projects(projectName) VALUES (?)";
    db.query(insertdata, [projectName], (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
})


//click modal and get data
app.get("/modalclick/:id", (req, res) => {
    const id = req.params.id
    const modaldata = `SELECT COUNT(*) as absent FROM atte WHERE attvalue = 0 and PM_id=${id} order by atte_id DESC LIMIT 7;`;
    db.query(modaldata, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }

    })
})

app.get("/gettotalshifts/:id", (req, res) => {
    const id = req.params.id
    const modaldata = `SELECT COUNT(attstatus) *9 AS multiplied_count FROM atte WHERE attvalue = 1 and PM_id=${id} order by atte_id DESC LIMIT 7;`;
    db.query(modaldata, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }

    })
})

app.get("/getstatusmember/:id", (req, res) => {
    const id = req.params.id
    const modaldata = `select  p.member,a.attstatus from atte a join projectmember p on p.PM_id=a.PM_id where a.attdate="28-02-2023" and a.proj_id=1 order by p.member;;`;
    db.query(modaldata, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }

    })
})






//insert members by admin
app.post("/addmembers/:project_id/:role_id", (req, res) => {
    const { member } = req.body;
    const id = req.params.project_id;
    const role_id = req.params.role_id;
    const addmemberdata = `insert into projectmember (member, project_id, role_id) values (?, ?, ?);`;
    db.query(addmemberdata, [member, id, role_id], (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});


app.post("/addproject", (req, res) => {
    const { projectName } = req.body

    const addmemberdata = `insert into projects (projectName) values (?);`;
    db.query(addmemberdata, [projectName], (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    })
})

app.post("/addrole/:project_id", (req, res) => {
    const { role_name } = req.body;
    const { project_id } = req.params; // Retrieve project_id from route parameter

    if (!role_name || !project_id) {
        res.status(400).json({ error: "role_name and project_id are required fields" });
        console.log(role_name, project_id);
        return;
    }

    const addmemberdata = `INSERT INTO roles (role_name, project_id) VALUES (?, ?);`;
    console.log(role_name, project_id);
    db.query(addmemberdata, [role_name, project_id], (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "An error occurred while executing the database query" });
        } else {
            res.json(doc);
        }
    });
});













app.listen(9000, () => {
    console.log("server is listening at 9000");
})
