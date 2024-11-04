import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import { AccessError, InputError } from "./error";
import {
  getEmailFromAuthorization,
  getStore,
  login,
  logout,
  register,
  save,
  setStore,
  getPresentations,
  addPresentation,
  updatePresentation,
} from "./service";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const catchErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
    save();
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: "A system error ocurred" });
    }
  }
};

/***************************************************************
                       Auth Function
***************************************************************/

const authed = (fn) => async (req, res) => {
  const email = getEmailFromAuthorization(req.header("Authorization"));
  await fn(req, res, email);
};

app.post(
  "/admin/auth/login",
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  })
);

app.post(
  "/admin/auth/register",
  catchErrors(async (req, res) => {
    const { email, password, name } = req.body;
    const token = await register(email, password, name);
    return res.json({ token });
  })
);

app.post(
  "/admin/auth/logout",
  catchErrors(
    authed(async (req, res, email) => {
      await logout(email);
      return res.json({});
    })
  )
);

/***************************************************************
                       Store Functions
***************************************************************/

app.get(
  "/store",
  catchErrors(
    authed(async (req, res, email) => {
      const store = await getStore(email);
      return res.json({ store });
    })
  )
);

app.put(
  "/store",
  catchErrors(
    authed(async (req, res, email) => {
      await setStore(email, req.body.store);
      return res.json({});
    })
  )
);

/***************************************************************
                       Presentation Functions
***************************************************************/

// Fetch all presentations
app.get(
  "/presentations",
  catchErrors(
    authed(async (req, res, email) => {
      const presentations = await getPresentations(email);
      return res.json({ presentations })
    })
  )
);

// Add a new presentation
app.post(
  "/presentations",
  catchErrors(
    authed(async (req, res, email) => {
      const presentation = req.body;
      const updatePresentations = await addPresentation(email, presentation);
      return res.json({ presentations: updatePresentations })
    })
  )
);

// Update an existing presentation 
app.put(
  "/presentations/:id",
  catchErrors(
    authed(async (req, res, email) => {
      const presentationId = parseInt(req.params.id, 10);
      const updatedData = req.body;
      const updatePresentations = await updatePresentation(
        email,
        presentationId,
        updatedData
      );
      return res.json({ presentations: updatePresentations });
    })
  )
);

/***************************************************************
                       Running Server
***************************************************************/

app.get("/", (req, res) => res.redirect("/docs"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const configData = JSON.parse(
  fs.readFileSync("../frontend/backend.config.json")
);

const port = "BACKEND_PORT" in configData ? configData.BACKEND_PORT : 5000;

const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
