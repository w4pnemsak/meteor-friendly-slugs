URL Friendly slugs for Meteor
------------------------
This package has two main purposes:

1. Make it easy to create a sanitized and URL friendly slug based off of an existing field or fields.
2. Auto-increment the slug if needed to ensure each item has a unique URL

Features
------------------------
- Automatically assign a URL friendly slug based on a field or fields of your specification. The slug will be sanitized following these rules:
  - Uses all lowercase letters
  - Transliterates accented and other variants (see [Transliteration](#transliteration))
  - Replace spaces with -
  - Removes apostrophes
  - Replace anything that is not 0-9, a-z, or - with -
  - Replace multiple - with single -
  - Trim - from start of text
  - Trim - from end of text
- Checks other items in the collection for the same slug, adds an auto-incrementing index to the end if needed. For example if a slug is based of a field who's value is "Foo Bar" and there is another item with the same value, the new slug will be 'foo-bar-1'.
- Can create slugs for multiple fields, and from multiple fields.
- Can optionally create a slug without the auto-incrementing index.
- Can optionally update a slug when the field it is based from is updated.
- Do all of these things efficiently, storing the base and index for a quick query

Installation
------------------------
```
meteor add w4pnemsak:friendly-slugs
```

Usage
------------------------

After you define your collection with something like:
```
Collection = new Mongo.Collection("collection");
```

You can call the friendlySlugs function a few different ways:

#### No options
```
Collection.friendlySlugs();
```
This will look for a field named 'name' and create a slug field named 'slug'

#### Specify field only
```
Collection.friendlySlugs('name');
```
This will create a 'slug' field based off of the field you specify

#### Include any options
```
Collection.friendlySlugs(
  {
    slugFrom: 'name',
    slugField: 'slug',
    distinct: true,
    updateSlug: true
  }
);
```
These are the default values, include what you would like to change

#### Slug Multiple Fields
```
Collection.friendlySlugs([
  {
    slugFrom: 'name',
    slugField: 'slug',
  },
  {
    slugFrom: ['profile.firstName', 'profile.lastName'],
    slugField: 'slug2',
  }
]);
```
Each field specified will create a slug to the slug field specified.

#### Routing
This package does not extend any router, but should play nicely with any router you are using. You can select your items using normal means by querying the slugField. Here is an iron router example in coffeescript:
```
@route "/collection/:slug",
  name:'collection'
  waitOn: ->
    @subscribe 'collection', @params.slug
  data: ->
    return Collection.findOne({slug:@params.slug})
```

Options
------------------------

Option | Default | Description
--- | --- | ---
slugFrom | 'name' | Name of field (or array of names) you want to base the slug from. Does support nested fields using dot notation for example "profile.name" If an array is provided slug will be built from field values separated by '-' in the order they appear in the array. *String or Array*
slugField | 'slug' | Name of field you want the slug to be stored to. This can be a nested field. *String*
distinct | true |  True = Slugs are unique, if 'foo' is already a stored slug for another item, the new item's slug will be 'foo-1' False = Slugs will not be unique, items can have the same slug as another item in the same collection. *Boolean*
distinctUpTo | [] | if distinct = true list of fields of the collection that define the validity range of the distinction *Array of Strings*
updateSlug | true | True = Update the item's slug if the slugField's content changes in an update. False = Slugs do not change when the slugField changes. Also can provide a function (doc,modifier) which returns true or false *Boolean or Function*
createOnUpdate | true | True = If an item is updated and the slug has not been created yet and the slugField has not changed, create the slug during the update False = Slugs will not be created during an update unless updateSlug = true in your settings and the slugField has changed. *Boolean*
maxLength | 0 (unlimited) | Limit how many characters the slug will be. This will not break words, but will break mid-sentence. Use 0 for no limit. *Number*
transliteration | see default array in [Transliteration](#transliteration) | Translates characters with accents to URL compatible characters, see [Transliteration](#transliteration) for more info.
debug | false | Turn to true to get console debug messages.
slugGenerator | | Provide a custom function to generate the slug. Accepts baseSlug and index, returns the full slug. It is up to you to verify the uniqueness of the slug if you provide a custom function. *Function* (defaultSlug, index) return fullSlug

Transliteration
------------------------
The default settings transliterate characters with accents and other variations to the closest english ASCII alphanumeric equivelant. The conversion is customizable, so you can transliterate from any characters to any character(s).

The tranliteration setting can be set as such: (this example is the default usage, you don't need to add the option to get these results.) (coffeescript)

```
Collection.friendlySlugs
  transliteration: [
    {from: 'àáâäåãа', to: 'a'}
    {from: 'б',      to: 'b'}
    {from: 'ç',      to: 'c'}
    {from: 'д',      to: 'd'}
    {from: 'èéêëẽэе',to: 'e'}
    {from: 'ф',      to: 'f'}
    {from: 'г',      to: 'g'}
    {from: 'х',      to: 'h'}
    {from: 'ìíîïи',  to: 'i'}
    {from: 'к',      to: 'k'}
    {from: 'л',      to: 'l'}
    {from: 'м',      to: 'm'}
    {from: 'ñн',     to: 'n'}
    {from: 'òóôöõо', to: 'o'}
    {from: 'п',      to: 'p'}
    {from: 'р',      to: 'r'}
    {from: 'с',      to: 's'}
    {from: 'т',      to: 't'}
    {from: 'ùúûüу',  to: 'u'}
    {from: 'в',      to: 'v'}
    {from: 'йы',     to: 'y'}
    {from: 'з',      to: 'z'}
    {from: 'æ',      to: 'ae'}
    {from: 'ч',      to: 'ch'}
    {from: 'щ',      to: 'sch'}
    {from: 'ш',      to: 'sh'}
    {from: 'ц',      to: 'ts'}
    {from: 'я',      to: 'ya'}
    {from: 'ю',      to: 'yu'}
    {from: 'ж',      to: 'zh'}
    {from: 'ъь',     to: ''}
  ]
```

```
"...Only alphanumerics [0-9a-zA-Z], the special characters "$-_.+!*'()," [not including the quotes - ed], and reserved characters used for their reserved purposes may be used unencoded within a URL."
```
For the slug part of the URL, we are only allowing a-z, 0-9, and -
This keeps in accordance with [RFC 1738](http://www.rfc-editor.org/rfc/rfc1738.txt) explained [here in a more helpful way](http://www.blooberry.com/indexdot/html/topics/urlencoding.htm)

Setting Distinct Fields
------------------------
Using the `distinctUpTo` option (which is relevant only if `distinct = true`) you can specify what fields need to match in order to cause the slug to increment the ID at the end.

Business case: The slug have to be distinct not for the whole collection but only for the given user.
Example, we insert:

```
{title:'Title A', created_user_id:'U1' }
{title:'Title B', created_user_id:'U1' }
{title:'Title C', created_user_id:'U2' }
{title:'Title B', created_user_id:'U2' }
{title:'Title C', created_user_id:'U2' }
```

And the generated slugs are:
```
title-a
title-b
title-c
title-b
title-c-1
```

The url can then be formatted using the created_user_id as part of the URL:

http://.../:user/:slug

Multiple fields can be specified for more specific distinction.

Usage:
```
Collection.friendlySlugs(
  {
    slugFrom: 'name',
    slugField: 'slug',
    ...
    distinctUpTo: ['created_user_id','another_field']
  });
```
Upserts are not supported yet
------------------------
The underlying package friendlySlugs uses for insert/update hooks (https://github.com/matb33/meteor-collection-hooks/) doesn't support upsert yet; see https://github.com/matb33/meteor-collection-hooks/issues/88. Once that package supports upsert, I will update this package to support it as well. For now, you can split the upsert into insert / update code if you would like to use this package.

Updates Using multi=true
------------------------
This package will not update slugs for Documents when an update is for multiple documents (multi=true)
When I was attempting to get these to work right, it kept using the slug from the first document for all subsequent documents. If you wish to work on this issue, a PR would be welcome.

Creating Slugs in Bulk for Existing Documents
------------------------
If you need to create slugs for existing documents, modify the following code to your needs and place in a server file (coffeescript) Increase the limit slowly as your server / workstation can handle. Comment this out or remove once all documents are updated.
```
Meteor.startup ->
  docs = Collection.find({ slug: {$exists: false}},{limit:50})
  count = 0
  docs.forEach (doc) ->
    Collection.update({_id:doc._id},{$set:{fake:''}})
    count += 1
  console.log 'Update slugs for ' + count + ' Documents.'
```

Wishlist
------------------------
- Register a 301 redirect for old URLs when the slug has changed.
  *Anyone have any ideas on how this could be accomplished?*
- Create 1 slug based off of 2 fields.
- Let me know if you think anything else would be beneficial.

Feedback / Bugs / Fixes
------------------------
This is a pretty new package, let me know if something isn't working for your use case.

Feedback and PRs are welcome.
