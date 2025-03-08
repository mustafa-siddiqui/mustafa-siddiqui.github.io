# Making site data-driven and extensible

The goal of this effort is to put the data the site is going to consume at an isolated
location and make it extensible such that adding new entries don't require html or css
additions/modifications.
For example, you want to add a new section, just update the data file and boom.
Good to go.

There's two ways that come to my mind to do this...

1. Dynamic data loading  
This is basically what I have right now.
The script reads the data file and populates appropriate sections once all the data has been loaded.

1. Static HTML generation
The site is a static site and I don't intend on making it dynamic in the near future.
This approach would allow better data encapsulation by defining custom types in yaml.
This would also require a custom parser, however.
Using that custom parser, perhaps I could do some file generation stuff with jinja/mustache templates.
This would involve:
    1. A mustache/jinja template for html file
    1. Defining custom types in yaml to better define sections
    1. Parsing the data
    1. Generating an html file by populating fields in the html template file

Both approaches meet the need at hand.
My preference would be to choose the one that allows me to keep the existing styling without much pain.
