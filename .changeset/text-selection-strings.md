---
'@kungal/ui-vue': minor
'@kungal/ui-core': minor
---

Seven new locale strings under `textSelection`: `copy`, `cut`, `paste`, `selectAll`, `share`, `lookUp` and `searchWeb`. They label the menu a text field shows over its selection, and only the Flutter port draws that menu: on the web the browser draws its own, so no web component renders them and nothing on a page changes. They are in the shared catalogs because `kun_ui_messages` is generated from the same source, and a string that exists on one platform only is what that pipeline exists to prevent. If you supply a full catalog of your own for another language, add the group; the wording follows Flutter's own `WidgetsLocalizations` for both built-in languages.
