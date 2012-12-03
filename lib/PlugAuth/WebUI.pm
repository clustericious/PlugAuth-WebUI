package PlugAuth::WebUI;

use strict;
use warnings;
use v5.10;
use Path::Class::Dir;
use Path::Class::File;
use File::ShareDir qw( dist_dir );

# ABSTRACT: JavaScript WebUI for PlugAuth
# VERSION

=head1 FUNCTIONS

=head2 PlugAuth::WebUI->share_dir

Returns an instance of L<Path::Class::Dir> which points to the
directory that contains the web UI for PlugAuth.

=cut

sub share_dir
{
  state $path;

  unless(defined $path)
  {
    # if $VERSION is not defind then we've added the lib
    # directory to PERL5LIB, and we should find the share
    # directory relative to the WebUI.pm module which is
    # still in its dist.  Otherwise, we can use File::ShareDir
    # to find the distributions share directory for this
    # distribution.
    if(defined $PlugAuth::WebUI::VERSION)
    {
      # prod
      $path = Path::Class::Dir
        ->new(dist_dir('PlugAuth-WebUI'));
    }
    else
    {
      # dev
      $path = Path::Class::File
        ->new($INC{'PlugAuth/WebUI.pm'})
        ->absolute
        ->dir
        ->parent
        ->parent
        ->subdir('public');
    }
  }
  
  $path;
}

1;
