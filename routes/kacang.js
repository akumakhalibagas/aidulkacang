var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET kacang page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM kacang",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("kacang/list", {
          title: "kacang",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var kacang = {
        id: req.params.id,
      };

      var delete_sql = "delete from kacang where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          kacang,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/kacang");
            } else {
              req.flash("msg_info", "Delete kacang Success");
              res.redirect("/kacang");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM kacang where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/kacang");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Data can't be find!");
              res.redirect("/kacang");
            } else {
              console.log(rows);
              res.render("kacang/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("jenis_kacang", "Please fill the jenis_kacang").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_jenis_kacang = req.sanitize("jenis_kacang").escape().trim();
      v_stok_per_kg = req.sanitize("stok_per_kg").escape().trim();
      v_harga_per_kg = req.sanitize("harga_per_kg").escape().trim();

      var kacang = {
        jenis_kacang: v_jenis_kacang,
        stok_per_kg: v_stok_per_kg,
        harga_per_kg: v_harga_per_kg,
      };

      var update_sql = "update kacang SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          kacang,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("kacang/edit", {
                jenis_kacang: req.param("jenis_kacang"),
                stok_per_kg: req.param("stok_per_kg"),
                harga_per_kg: req.param("harga_per_kg"),
              });
            } else {
              req.flash("msg_info", "Update kacang success");
              res.redirect("/kacang/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/kacang/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("jenis_kacang", "Please fill the jenis_kacang").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_jenis_kacang = req.sanitize("jenis_kacang").escape().trim();
    v_stok_per_kg = req.sanitize("stok_per_kg").escape().trim();
    v_harga_per_kg = req.sanitize("harga_per_kg").escape().trim();

    var kacang = {
      jenis_kacang: v_jenis_kacang,
      stok_per_kg: v_stok_per_kg,
      harga_per_kg: v_harga_per_kg,
    };

    var insert_sql = "INSERT INTO kacang SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        kacang,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("kacang/add-kacang", {
              jenis_kacang: req.param("jenis_kacang"),
              stok_per_kg: req.param("stok_per_kg"),
              harga_per_kg: req.param("harga_per_kg"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create kacang success");
            res.redirect("/kacang");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("kacang/add", {
      jenis_kacang: req.param("jenis_kacang"),
      stok_per_kg: req.param("stok_per_kg"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("kacang/add", {
    title: "Add New kacang",
    jenis_kacang: "",
    stok_per_kg: "",
    harga_per_kg: "",
    waktu: "",
    session_store: req.session,
  });
});

module.exports = router;
