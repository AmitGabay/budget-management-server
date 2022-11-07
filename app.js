import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connectDB from "./db.js";
import User from "./models/user.js";

const app = express();
const { PORT = 5000, KEY } = process.env;
const saltRounds = 10;

connectDB();

app.use(bodyParser.json());

app.use(cors({ origin: ["http://localhost:3000"] }));

app.use((req, _, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const { userId } = jwt.verify(authorization, KEY);
    req.userId = userId;
  }

  next();
});

app
  .post("/Login", async (req, res) => {
    const { email, password } = req.body;
    const doc = await User.findOne({ email });

    if (!doc) return res.sendStatus(403);

    const result = await bcrypt.compare(password, doc.password);

    if (!result) return res.sendStatus(403);

    const token = jwt.sign({ userId: doc._id }, KEY, { expiresIn: 6000 });
    doc.token = token;

    doc.save();
    res.status(201).send({ token });
  })

  .post("/Signup", async (req, res) => {
    const { email, password } = req.body;
    const doc = await User.findOne({ email });

    if (doc) return res.sendStatus(409);

    const hash = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, password: hash });

    try {
      const token = jwt.sign({ userId: user._id }, KEY, { expiresIn: 60 });
      user.token = token;

      await user.save();
      res.status(201).send({ token });
    } catch (err) {
      res.sendStatus(500);
    }
  })

  .get("/", async (req, res) => {
    const doc = await User.findById(req.userId);
    res.send(doc.expenses);
  })

  .post("/", async (req, res) => {
    const data = req.body.expenses;
    const doc = await User.findByIdAndUpdate(
      req.userId,
      { expenses: data },
      { new: true }
    );

    res.status(200).send(doc.expenses);
  });

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
