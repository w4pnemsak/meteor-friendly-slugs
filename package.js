Package.describe({
  name: 'w4pnemsak:friendly-slugs',
  version: '0.6.1',
  // Brief, one-line summary of the package.
  summary: 'Generate URL friendly slugs from a field with auto-incrementation to ensure unique URLs.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/w4pnemsak/meteor-friendly-slugs.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['underscore','coffeescript', 'check','meteor:meteor-collection-hooks']);
  api.versionsFrom('1.0');
  api.addFiles('slugs.coffee');
});
