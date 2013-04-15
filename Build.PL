
use strict;
use warnings;

use Module::Build 0.3601;


my %module_build_args = (
  "build_requires" => {
    "Module::Build" => "0.3601",
    "Test::More" => 0
  },
  "configure_requires" => {
    "Module::Build" => "0.3601"
  },
  "dist_abstract" => "JavaScript WebUI for PlugAuth",
  "dist_author" => [
    "Graham Ollis <graham.a.ollis\@nasa.gov>"
  ],
  "dist_name" => "PlugAuth-WebUI",
  "dist_version" => "0.07",
  "license" => "perl",
  "module_name" => "PlugAuth::WebUI",
  "recommends" => {},
  "recursive_test_files" => 1,
  "requires" => {
    "File::Copy" => 0,
    "File::ShareDir" => 0,
    "Getopt::Long" => 0,
    "Path::Class" => 0,
    "Path::Class::Dir" => 0,
    "Path::Class::File" => 0,
    "perl" => "v5.10.0"
  },
  "script_files" => [
    "bin/plugauth_webui_install"
  ],
  "share_dir" => {
    "dist" => "share"
  }
);


my $build = Module::Build->new(%module_build_args);

$build->create_build_script;
