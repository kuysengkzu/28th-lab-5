const express  = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const EmployeeSchema = mongoose.Schema({
  empid: { type: Number },
  name: { type: String },
  emailid: { type: String },
  password: { type: String }
});
const EmployeeModel = mongoose.model('employees', EmployeeSchema);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true }
  )
  .then(() =>console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// APIs
app.get('/employees', async (_req, res) => {
  const records = await EmployeeModel.find();
  res.send(records);
});

app.post('/employees', async (req, res) => {
  const { empid, name, emailid, password } = req.body;
  let employee = await EmployeeModel.findOne({ emailid });
  if(employee) {
    res.status(409).send({ msg: "EMAILID ALREADY REGISTERED" });
  } else {
    employee = new EmployeeModel({ empid, name, emailid, password });
    await employee.save();
    res.status(201).send(employee);
  }
});

// Server
const port = 3000;
app.listen(port, () => console.log(`Server running at port no ${port}`));