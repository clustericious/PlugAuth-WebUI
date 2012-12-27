
use strict;
use warnings;

use Module::Build 0.3601;


my %module_build_args = (
  "build_requires" => {
    "Module::Build" => "0.3601",
    "Test::More" => 0
  },
  "configure_requires" => {
    "ExtUtils::MakeMaker" => "6.30",
    "File::ShareDir::Install" => "0.03",
    "Module::Build" => "0.3601"
  },
  "dist_abstract" => "JavaScript WebUI for PlugAuth",
  "dist_author" => [
    "Graham Ollis <gollis\@sesda2.com>"
  ],
  "dist_name" => "PlugAuth-WebUI",
  "dist_version" => "0.03",
  "license" => "perl",
  "module_name" => "PlugAuth::WebUI",
  "recommends" => {},
  "recursive_test_files" => 1,
  "requires" => {
    "File::ShareDir" => 0,
    "Path::Class::Dir" => 0,
    "Path::Class::File" => 0,
    "perl" => "v5.10.0",
    "strict" => 0,
    "warnings" => 0
  },
  "script_files" => [],
  "share_dir" => {
    "dist" => "public"
  }
);


my $build = Module::Build->new(%module_build_args);

$build->create_build_script;
