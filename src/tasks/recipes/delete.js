'use strict';

/*
 |----------------------------------------------------------------
 | Delete
 |----------------------------------------------------------------
 | 删除指定文件或文件夹
 |
 */

var del = require("del");

Elixir.extend('delete', function (folders, files) {
    new Elixir.Task('delete', function ($) {

        if( folders && folders instanceof Array)
        folders.forEach(function (path) {
            del([ Elixir.config.publicPath + '/' + path +  '/**'], {force: true});
        });

        if( files && files instanceof Array)
        files.forEach(function (path) {
            del([ Elixir.config.publicPath + '/' + path], {force: true});
        });
    });
});