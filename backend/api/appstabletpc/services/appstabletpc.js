"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

var mysql = require("mysql");
const db_config = require("../../../config/confs").db_config;
var sql = mysql.createPool(db_config);

module.exports = {
  checkTableEntry(data) {
    var table = data.table;
    var args = [data.user, data.data, data.frame];
    return new Promise(function (resolve, reject) {
      sql.query(
        `select id, user, turma, codprof, escola, tema, subtema, frame, data, certas, total
                from ${table} 
                where user=? and (data=?) and frame=?;`,
        args,
        function (err, res) {
          if (err) {
            console.log("error: ", err);
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  // Inserir entrada numa tabela da appstabletpc
  createTableEntry(data) {
    var table = data.table;
    var args = [
      data.user,
      data.turma,
      data.codprof,
      data.escola,
      data.tema,
      data.subtema,
      data.frame,
      data.data,
      data.certas,
      data.total,
    ];
    return new Promise(function (resolve, reject) {
      sql.query(
        "INSERT INTO " +
          table +
          " ( `user`, `turma`, `codprof`, `escola`, `tema`, `subtema`, `frame`, `data`, `certas`, `total`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args,
        function (err, res) {
          if (err) {
            console.log("error: ", err);
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  updateTableEntry(oldData, body) {
    var table = body.table;
    let certas = oldData.certas + parseInt(body.certas);
    let total = oldData.total + parseInt(body.total);
    var args = [certas, total, oldData.id];
    return new Promise(function (resolve, reject) {
      sql.query(
        "UPDATE " + table + " SET certas = ?, total = ? where id = ?;",
        args,
        function (err, res) {
          if (err) {
            console.log("error: ", err);
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
};
