package PlugAuth::WebUI;

use strict;
use warnings;
use 5.010;
use Path::Class::Dir;
use Path::Class::File;
use File::ShareDir::Dist qw( dist_share );

# ABSTRACT: JavaScript WebUI for PlugAuth
# VERSION

=head1 FUNCTIONS

=head2 PlugAuth::WebUI->share_dir

Returns an instance of L<Path::Class::Dir> which points to the
directory that contains the web UI for PlugAuth.

=cut

# TODO:  add a way to force non minified version of the js
#        and expose this in the PlugAuth::Plugin::WebUI config

sub share_dir
{
  state $path;
  $path //= Path::Class::Dir->new(dist_share('PlugAuth-WebUI')) or die "unable to find share directory";
}

=head2 PlugAuth::WebUI->get_data

Returns the stash data needed to generate the html from the ep template.

=cut

sub get_data
{
  my $data = {
    js                  => [ ],
    title               => 'PlugAuth WebUI',
    description         => 'PlugAuth server Web user interface',
    plugauth_webui_data => { skip_login => 0 },
  };
  if(-r __PACKAGE__->share_dir->file('js', 'pawu.min.js'))
  {
    push @{ $data->{js} }, 'pawu.min.js';
  }
  else
  {
    foreach my $js (sort grep { $_->basename =~ /^pawu-.*\.js$/} __PACKAGE__->share_dir->subdir('js')->children( no_hidden => 1))
    {
      push @{ $data->{js} }, $js->basename;
    }
  }
  $data;
}

1;

=head1 BUNDLED FILES

This distribution includes a few files with different licenses that have been bundled for the
implementation of the PlugAuth WebUI.

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

=head2 Bootstrap Date Picker

http://www.eyecon.ro/bootstrap-datepicker/

Copyright 2012 Stefan Petre

Licensed under the Apache 2.0 License

=head2 cvs-string

https://npmjs.org/package/csv-string

Copyright 2011 Nicolas Thouvenin <nthouvenin@gmail.com>

Licensed under the MIT/X11 license

=cut
