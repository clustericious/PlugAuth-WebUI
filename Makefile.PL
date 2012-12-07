
use strict;
use warnings;

use 5.010000;

use ExtUtils::MakeMaker 6.30;

use File::ShareDir::Install;
install_share dist => "public";


my %WriteMakefileArgs = (
  "ABSTRACT" => "JavaScript WebUI for PlugAuth",
  "AUTHOR" => "Graham Ollis <gollis\@sesda2.com>",
  "BUILD_REQUIRES" => {
    "Module::Build" => "0.3601",
    "Test::More" => 0
  },
  "CONFIGURE_REQUIRES" => {
    "ExtUtils::MakeMaker" => "6.30",
    "File::ShareDir::Install" => "0.03",
    "Module::Build" => "0.3601"
  },
  "DISTNAME" => "PlugAuth-WebUI",
  "EXE_FILES" => [],
  "LICENSE" => "perl",
  "NAME" => "PlugAuth::WebUI",
  "PREREQ_PM" => {
    "File::ShareDir" => 0,
    "Path::Class::Dir" => 0,
    "Path::Class::File" => 0,
    "strict" => 0,
    "warnings" => 0
  },
  "VERSION" => "0.01",
  "test" => {
    "TESTS" => "t/*.t"
  }
);


unless ( eval { ExtUtils::MakeMaker->VERSION(6.56) } ) {
  my $br = delete $WriteMakefileArgs{BUILD_REQUIRES};
  my $pp = $WriteMakefileArgs{PREREQ_PM};
  for my $mod ( keys %$br ) {
    if ( exists $pp->{$mod} ) {
      $pp->{$mod} = $br->{$mod} if $br->{$mod} > $pp->{$mod};
    }
    else {
      $pp->{$mod} = $br->{$mod};
    }
  }
}

delete $WriteMakefileArgs{CONFIGURE_REQUIRES}
  unless eval { ExtUtils::MakeMaker->VERSION(6.52) };

WriteMakefile(%WriteMakefileArgs);

{
package
MY;
use File::ShareDir::Install qw(postamble);
}


