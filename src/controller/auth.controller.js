const { db } = require("../util/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keyToken = "LWEJROI32209";

exports.getList = async (req, res) => {
  let sql = `
    SELECT 
      u.id, 
      u.name, 
      u.username,
      u.is_active,
      r.name AS role_name
    FROM user u
    INNER JOIN role r ON u.role_id = r.id
  `;

  const [list] = await db.query(sql);

  res.json({
    list: list,
  });
};
exports.register = async (req, res) => {
  try {
    let password = bcrypt.hashSync(req.body.password, 10);

    let sql = `
      INSERT INTO user
      (
        role_id,
        name,
        username,
        password,
        is_active,
        create_by
      )
      VALUES
      (
        :role_id,
        :name,
        :username,
        :password,
        :is_active,
        :create_by
      )
    `;

    let [data] = await db.query(sql, {
      role_id: req.body.role_id,
      name: req.body.name,
      username: req.body.username,
      password: password,
      is_active: req.body.is_active,
      create_by: req.body.create_by,
    });

    res.json({
      message: "Register success",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    let { username, password } = req.body;

    let sql = `
      SELECT *
      FROM user
      WHERE username=:username
    `;

    let [data] = await db.query(sql, {
      username: username,
    });

    // username not found
    if (data.length === 0) {
      return res.json({
        error: {
          username: "Username not found",
        },
      });
    }

    let user = data[0];

    // compare password
    let isCorrectPw = bcrypt.compareSync(password, user.password);

    // password incorrect
    if (!isCorrectPw) {
      return res.json({
        error: {
          password: "Password not match",
        },
      });
    }

    // remove password
    delete user.password;

    // create token
    const access_token = await getAccessToken(user);

    res.json({
      message: "Login success",
      data: user,
      access_token: access_token,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    let sql = `
      SELECT 
        id,
        role_id,
        name,
        username,
        is_active,
        create_by
      FROM user
      WHERE id=:id
    `;

    let [data] = await db.query(sql, {
      id: req.current_id,
    });

    if (data.length === 0) {
      return res.json({
        error: "User not found",
      });
    }

    res.json({
      message: "Profile",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= CREATE TOKEN =================
const getAccessToken = async (user) => {
  const data = {
    id: user.id,
    name: user.name,
    username: user.username,
  };

  const access_token = jwt.sign({ data: data }, keyToken, { expiresIn: "7d" });

  return access_token;
};

// ================= VALIDATE TOKEN =================
exports.validate_token = () => {
  return (req, res, next) => {
    // get authorization header
    const authorization = req.headers.authorization;

    let token_from_client = null;

    // check authorization
    if (authorization != null && authorization != "") {
      // Bearer xxxxxxxxx
      token_from_client = authorization.split(" ");

      // get token only
      token_from_client = token_from_client[1];
    }

    // token missing
    if (token_from_client == null) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    // verify token
    jwt.verify(token_from_client, keyToken, (error, result) => {
      // token invalid
      if (error) {
        return res.status(401).send({
          message: "Unauthorized",
          error: error,
        });
      }

      // save user data in request
      req.current_id = result.data.id;
      req.current_name = result.data.name;
      req.current_username = result.data.username;

      next();
    });
  };
};
