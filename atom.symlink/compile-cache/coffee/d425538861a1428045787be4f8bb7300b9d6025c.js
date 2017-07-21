(function() {
  var Languages, _, jsonStringify, langs, languages;

  jsonStringify = require('json-stable-stringify');

  Languages = require('../src/languages');

  languages = new Languages().languages;

  _ = require('lodash');

  langs = _.chain(languages).map(function(lang) {
    return {
      name: lang.name,
      namespace: lang.namespace,
      extensions: lang.extensions || [],
      atomGrammars: lang.grammars || [],
      sublimeSyntaxes: []
    };
  }).value();

  console.log(jsonStringify(langs, {
    space: 2
  }));

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N0YWdlLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc2NyaXB0L2xpc3Qtb3B0aW9ucy1hbmQtbGFuZ3VhZ2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsdUJBQVI7O0VBQ2hCLFNBQUEsR0FBWSxPQUFBLENBQVEsa0JBQVI7O0VBQ1osU0FBQSxHQUFZLElBQUksU0FBQSxDQUFBLENBQVcsQ0FBQzs7RUFFNUIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQWFKLEtBQUEsR0FBUSxDQUFDLENBQUMsS0FBRixDQUFRLFNBQVIsQ0FDRSxDQUFDLEdBREgsQ0FDTyxTQUFDLElBQUQ7QUFDSCxXQUFPO01BQ0wsSUFBQSxFQUFNLElBQUksQ0FBQyxJQUROO01BRUwsU0FBQSxFQUFXLElBQUksQ0FBQyxTQUZYO01BR0wsVUFBQSxFQUFZLElBQUksQ0FBQyxVQUFMLElBQW1CLEVBSDFCO01BSUwsWUFBQSxFQUFjLElBQUksQ0FBQyxRQUFMLElBQWlCLEVBSjFCO01BS0wsZUFBQSxFQUFpQixFQUxaOztFQURKLENBRFAsQ0FVRSxDQUFDLEtBVkgsQ0FBQTs7RUFXUixPQUFPLENBQUMsR0FBUixDQUFZLGFBQUEsQ0FBYyxLQUFkLEVBQXFCO0lBQy9CLEtBQUEsRUFBTyxDQUR3QjtHQUFyQixDQUFaO0FBNUJBIiwic291cmNlc0NvbnRlbnQiOlsianNvblN0cmluZ2lmeSA9IHJlcXVpcmUoJ2pzb24tc3RhYmxlLXN0cmluZ2lmeScpXG5MYW5ndWFnZXMgPSByZXF1aXJlKCcuLi9zcmMvbGFuZ3VhZ2VzJylcbmxhbmd1YWdlcyA9IG5ldyBMYW5ndWFnZXMoKS5sYW5ndWFnZXNcbiMgY29uc29sZS5sb2cobGFuZ3VhZ2VzLmxlbmd0aClcbl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuIyBvcHRpb25zID0gXy5jaGFpbihsYW5ndWFnZXMpXG4jICAgICAgICAgICAgIC5tYXAoKGxhbmcpIC0+IHJldHVybiBsYW5nLm9wdGlvbnMgb3IgW10pXG4jICAgICAgICAgICAgIC5mbGF0dGVuKClcbiMgICAgICAgICAgICAgLnJlZHVjZSgocmVzdWx0LCB2YWx1ZSkgLT5cbiMgICAgICAgICAgICAgICBfLm1lcmdlKHJlc3VsdCwgdmFsdWUpXG4jICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuIyAgICAgICAgICAgICAsIHt9KVxuIyAgICAgICAgICAgICAudmFsdWUoKVxuIyBjb25zb2xlLmxvZyhqc29uU3RyaW5naWZ5KG9wdGlvbnMsIHtcbiMgICBzcGFjZTogMlxuIyB9KSlcblxubGFuZ3MgPSBfLmNoYWluKGxhbmd1YWdlcylcbiAgICAgICAgICAubWFwKChsYW5nKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgbmFtZTogbGFuZy5uYW1lLFxuICAgICAgICAgICAgICBuYW1lc3BhY2U6IGxhbmcubmFtZXNwYWNlLFxuICAgICAgICAgICAgICBleHRlbnNpb25zOiBsYW5nLmV4dGVuc2lvbnMgb3IgW10sXG4gICAgICAgICAgICAgIGF0b21HcmFtbWFyczogbGFuZy5ncmFtbWFycyBvciBbXSxcbiAgICAgICAgICAgICAgc3VibGltZVN5bnRheGVzOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgICAudmFsdWUoKVxuY29uc29sZS5sb2coanNvblN0cmluZ2lmeShsYW5ncywge1xuICBzcGFjZTogMlxufSkpXG4iXX0=
