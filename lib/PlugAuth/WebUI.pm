package PlugAuth::WebUI;

use strict;
use warnings;
use v5.10;
use Path::Class::Dir;
use Path::Class::File;
use File::ShareDir qw( dist_dir );

# ABSTRACT: JavaScript WebUI for PlugAuth
# VERSION

=head1 NAME

PlugAuth::WebUI - JavaScript WebUI for PlugAuth

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

=head2 PlugAuth::WebUI->get_data

Returns the stash data needed to generate the html from the ep template.

=cut

sub get_data
{
  my $data = {
    js                  => [],
    title               => 'PlugAuth WebUI',
    description         => 'PlugAuth server Web user interface',
    plugauth_webui_data => {},
  };
  foreach my $js (grep { $_->basename =~ /^pawu-.*\.js$/} __PACKAGE__->share_dir->subdir('js')->children( no_hidden => 1))
  {
    push @{ $data->{js} }, $js->basename;
  }
  $data;
}

1;

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2012 by NASA GSFC.

This is free software; you can redistribute it and/or modify it under
the same terms as the Perl 5 programming language system itself.

=head2 jQuery

Copyright (c) 2012 jQuery Foundation and other contributors, http://jquery.org/

Licensed under the MIT License

=head2 jQuery base64 plugin

Original code (c) 2010 Nick Galbreath

jQuery port (c) 2010 Carlo Zottmann

Licensed under the MIT License

=head2 Twitter Bootstrap

Copyright 2012 Twitter, Inc.

Licensed under the Apache 2.0 License

=cut
