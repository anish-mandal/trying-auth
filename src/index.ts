import express, { type Express } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import path from "path";
import bcrypt from "bcrypt";

const app: Express = express();
const prisma: PrismaClient = new PrismaClient();

// app settings
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use("/static", express.static(path.join(__dirname, "../public")));

// frontend servings
app
  .get("/", (_, res) => {
    res.render("../views/index.ejs");
  })
  .get("/signup", (_, res) => {
    res.render("../views/signup.ejs");
  })
  .get("/login", (_, res) => {
    res.render("../views/login.ejs");
  })
  .get("/app/dashboard", (_, res) => {
    res.render("../views/dashboard.ejs");
  });

// server servings
app
  .post("/api/adduser", async (req, res) => {
    if (!(req.body.email && req.body.password)) {
      res.status(422).json({ message: "email and password required" });
      return;
    }

    try {
      await prisma.$connect();

      let existingUser = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (existingUser) {
        await prisma.$disconnect();
        res.status(200).json({ message: "user already exists" });
        return;
      }

      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(req.body.password, salt);

      let user = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
        },
      });

      res.status(200).json({ message: "user created", user: user });
      return;
    } catch (e) {
      await prisma.$disconnect();
      res.status(500).json({ message: "database error", error: e });
      return;
    } finally {
      await prisma.$disconnect();
    }
  })
  .post("/api/authuser", async (req, res) => {
    if (!(req.body.email && req.body.password)) {
      res.status(422).json({ message: "email and password required" });
      return;
    }

    let user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (validPassword) {
        let token = jwt.sign({ email: user.email }, process.env.SECRET);

        res.status(200).json({ message: "valid password", token: token });
        return;
      } else {
        res.status(400).json({ message: "invalid password" });
        return;
      }
    } else {
      res.status(401).json({ message: "user does not exists" });
    }
  });

app.listen(3000);
