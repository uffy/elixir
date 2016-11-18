# Laravel Elixir

## Introduction

Laravel Elixir provides a clean, fluent API for defining basic Gulp tasks for your Laravel application. Elixir supports several common CSS and JavaScript pre-processors, and even testing tools.

If you've ever been confused about how to get started with Gulp and asset compilation, you will love Laravel Elixir!

## Official Documentation

Documentation for Elixir can be found on the [Laravel website](http://laravel.com/docs/elixir).

## License

Laravel Elixir is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).


# 此 Fork 版本在原 Laravel-Elixir 6.0.0-14 基础，实现： 

1. 只写入更改过的文件。
2. gulp 后，删除久 rev-manifest.json 引用的无效文件。
3. production 模式下，不生成 map 文件。
