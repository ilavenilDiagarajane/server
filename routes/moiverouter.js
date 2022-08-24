import express from "express";
import { hashingpassword, auth } from "./auth.js";
import { moivedetails } from "./moiveschema.js";
import { userdetails } from "./userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
router.get("/", async function (req, res) {
  res.send("welcome to server");
});

router.post("/register", async function (req, res) {
  try {
    const isemailexist = await userdetails.findOne({ email: req.body.email });

    if (isemailexist) res.status(404).send({ error: "already registered" });
    else {
      const hashpass = await hashingpassword(req.body.password);

      const result = {
        email: req.body.email,
        password: hashpass,
        role: req.body.role,
      };
     
      const adduser = new userdetails(result);
      await adduser.save();
      res.status(200).send({ msg: "registered sucessfully" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    const isuserexist = await userdetails.findOne({ email: email });
    const passworduser = isuserexist.password;
    const roles = isuserexist.role;
    if (!isuserexist) {
      res.status(404).send({ error: "invalid credentials" });
    } else {
      const passmatch = await bcrypt.compare(password, passworduser);
      if (passmatch) {
        if (roles === "Admin") {
          const token = jwt.sign(
            { id: isuserexist.password },
            process.env.SECRET_KEY
          );
          res
            .status(200)
            .send({
              msg: "admin logged in",
              token: token,
              email: isuserexist.email,
            });
        } else {
          res
            .status(200)
            .send({ msg: "user logged in", email: isuserexist.email });
        }
      } else {
        res.status(401).send({ error: "invalid credentials" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "interval error" });
  }
});
router.get("/getmoives", async function (req, res) {
  const moiveList = await moivedetails.find({});

  try {
    res.status(200).send(moiveList);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post("/createmoives", async function (req, res) {
  const addMoive = new moivedetails(req.body);

  try {
    const ismoiveexist = await moivedetails.findOne({ name: req.body.name });
    if (ismoiveexist) res.status(404).send({ error: "moive is already exist" });
    else await addMoive.save();
    res.status(200).send({ msg: "Moive saved successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.put("/editmoives/:id", auth, async function (req, res) {
  try {
    const ismoiveedit = await moivedetails.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!ismoiveedit) res.status(404).send({ error: "no moives is updated" });
    res.status(200).send({ msg: "Moive updated successfully" });
  } catch (error) {}
});
router.delete("/removemoive/:id", auth, async function (req, res) {
  try {
    const ismoivedeleted = await moivedetails.findByIdAndDelete(req.params.id);
    if (!ismoivedeleted)
      res.status(404).send({ error: "no such moive is found" });
    res.status(200).send({ msg: "Moive deleted successfully", ismoivedeleted });
  } catch (error) {
    res.status(500).send(error);
  }
});
export const moiverouter = router;
