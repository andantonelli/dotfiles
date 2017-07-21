(function() {
  var DEFAULT_INDENT, DEFAULT_WARN_FN, adjust_space;

  DEFAULT_INDENT = '    ';

  adjust_space = function(line) {
    var comment, muli_string, string_list;
    string_list = line.match(/(['"])[^\1]*?\1/g);
    muli_string = line.match(/\[(=*)\[([^\]\1\]]*)/);
    comment = line.match(/\-{2}[^\[].*$/);
    line = line.replace(/\s+/g, ' ');
    line = line.replace(/\s?(==|>=|<=|~=|[=><\+\*\/])\s?/g, ' $1 ');
    line = line.replace(/([^=e\-\(\s])\s?\-\s?([^\-\[])/g, '$1 - $2');
    line = line.replace(/([^\d])e\s?\-\s?([^\-\[])/g, '$1e - $2');
    line = line.replace(/,([^\s])/g, ', $1');
    line = line.replace(/\s+,/g, ',');
    line = line.replace(/(['"])[^\1]*?\1/g, function() {
      return string_list.shift();
    });
    if (muli_string && muli_string[0]) {
      line = line.replace(/\[(=*)\[([^\]\1\]]*)/, muli_string[0]);
    }
    if (comment && comment[0]) {
      line = line.replace(/\-{2}[^\[].*$/, comment[0]);
    }
    return line;
  };

  DEFAULT_WARN_FN = function(msg) {
    return console.log('WARNING:', msg);
  };

  module.exports = function(str, indent, warn_fn, opts) {
    var $currIndent, $extIndent, $lastIndent, $nextIndent, $prevLength, $template, eol, new_code;
    if (opts == null) {
      opts = {};
    }
    eol = (opts != null ? opts.eol : void 0) || '\n';
    indent = indent || DEFAULT_INDENT;
    warn_fn = typeof warn_fn === 'function' ? warn_fn : DEFAULT_WARN_FN;
    if (Number.isInteger(indent)) {
      indent = ' '.repeat(indent);
    }
    $currIndent = 0;
    $nextIndent = 0;
    $prevLength = 0;
    $extIndent = 0;
    $lastIndent = 0;
    $template = 0;
    new_code = str.split(/\r?\n/g).map(function(line, line_number) {
      var $brackets, $curly, $template_flag, $useful, arr, code, comment, new_line, raw_line, res1, res2;
      $template_flag = false;
      if ($template) {
        res2 = line.match(/\](=*)\]/);
        if (res2 && $template === res2[1].length + 1) {
          $template_flag = true;
          if ($template && !/]=*]$/.test(line)) {
            arr = line.split(/\]=*\]/, 2);
            comment = arr[0];
            code = arr[1];
            line = comment + ']' + '='.repeat($template - 1) + ']' + adjust_space(code);
            $template = 0;
          }
          $template = 0;
        } else {
          return line;
        }
      }
      res1 = line.match(/\[(=*)\[/);
      if (res1) {
        $template = res1[1].length + 1;
      }
      if (!$template_flag) {
        line = line.trim();
        line = adjust_space(line);
      }
      if (!line.length) {
        return '';
      }
      raw_line = line;
      line = line.replace(/(['"])[^\1]*?\1/, '');
      line = line.replace(/\s*--.+/, '');
      if (/^((local )?function|repeat|while)\b/.test(line) && !/\bend\s*[\),;]*$/.test(line) || /\b(then|do)$/.test(line) && !/^elseif\b/.test(line) || /^if\b/.test(line) && /\bthen\b/.test(line) && !/\bend$/.test(line) || /\bfunction ?(?:\w+ )?\([^\)]*\)$/.test(line) && !/\bend$/.test(line)) {
        $nextIndent = $currIndent + 1;
      } else if (/^until\b/.test(line) || /^end\s*[\),;]*$/.test(line) || /^end\s*\)\s*\.\./.test(line) || /^else(if)?\b/.test(line) && /\bend$/.test(line)) {
        $nextIndent = --$currIndent;
      } else if (/^else\b/.test(line) || /^elseif\b/.test(line)) {
        $nextIndent = $currIndent;
        $currIndent = $currIndent - 1;
      }
      $brackets = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      $curly = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if ($curly < 0) {
        $currIndent += $curly;
      }
      if ($brackets < 0) {
        $currIndent += $brackets;
      }
      $nextIndent += $brackets + $curly;
      if ($currIndent - $lastIndent > 1) {
        $extIndent += $nextIndent - $lastIndent - 1;
        $nextIndent = $currIndent = 1 + $lastIndent;
      }
      if ($currIndent - $lastIndent < -1 && $extIndent > 0) {
        $extIndent += $currIndent - $lastIndent + 1;
        $currIndent = -1 + $lastIndent;
      }
      if ($nextIndent < $currIndent) {
        $nextIndent = $currIndent;
      }
      if ($currIndent < 0) {
        warn_fn("negative indentation at line " + line_number + ": " + raw_line);
      }
      new_line = (raw_line.length && $currIndent > 0 && !$template_flag ? indent.repeat($currIndent) : '') + raw_line;
      $useful = $prevLength > 0 || raw_line.length > 0;
      $lastIndent = $currIndent;
      $currIndent = $nextIndent;
      $prevLength = raw_line.length;
      return new_line || void 0;
    });
    if ($currIndent > 0) {
      warn_fn('positive indentation at the end');
    }
    return new_code.join(eol);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N0YWdlLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2x1YS1iZWF1dGlmaWVyL2JlYXV0aWZpZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxjQUFBLEdBQWlCOztFQUVqQixZQUFBLEdBQWUsU0FBQyxJQUFEO0FBQ2IsUUFBQTtJQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsS0FBTCxDQUFXLGtCQUFYO0lBQ2QsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFMLENBQVcsc0JBQVg7SUFDZCxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxlQUFYO0lBQ1YsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBYixFQUFxQixHQUFyQjtJQUVQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLGtDQUFiLEVBQWlELE1BQWpEO0lBRVAsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsaUNBQWIsRUFBZ0QsU0FBaEQ7SUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSw0QkFBYixFQUEyQyxVQUEzQztJQUVQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLFdBQWIsRUFBMEIsTUFBMUI7SUFFUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLEdBQXRCO0lBRVAsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsa0JBQWIsRUFBaUMsU0FBQTthQUN0QyxXQUFXLENBQUMsS0FBWixDQUFBO0lBRHNDLENBQWpDO0lBRVAsSUFBRyxXQUFBLElBQWdCLFdBQVksQ0FBQSxDQUFBLENBQS9CO01BQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsc0JBQWIsRUFBcUMsV0FBWSxDQUFBLENBQUEsQ0FBakQsRUFEVDs7SUFFQSxJQUFHLE9BQUEsSUFBWSxPQUFRLENBQUEsQ0FBQSxDQUF2QjtNQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLGVBQWIsRUFBOEIsT0FBUSxDQUFBLENBQUEsQ0FBdEMsRUFEVDs7V0FFQTtFQXJCYTs7RUF1QmYsZUFBQSxHQUFrQixTQUFDLEdBQUQ7V0FDaEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCLEdBQXhCO0VBRGdCOztFQUdsQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsT0FBZCxFQUF1QixJQUF2QjtBQUNmLFFBQUE7O01BRHNDLE9BQU87O0lBQzdDLEdBQUEsbUJBQU0sSUFBSSxDQUFFLGFBQU4sSUFBYTtJQUNuQixNQUFBLEdBQVMsTUFBQSxJQUFVO0lBQ25CLE9BQUEsR0FBYSxPQUFPLE9BQVAsS0FBa0IsVUFBckIsR0FBcUMsT0FBckMsR0FBa0Q7SUFDNUQsSUFBK0IsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBakIsQ0FBL0I7TUFBQSxNQUFBLEdBQVMsR0FBRyxDQUFDLE1BQUosQ0FBVyxNQUFYLEVBQVQ7O0lBQ0EsV0FBQSxHQUFjO0lBQ2QsV0FBQSxHQUFjO0lBQ2QsV0FBQSxHQUFjO0lBQ2QsVUFBQSxHQUFhO0lBQ2IsV0FBQSxHQUFjO0lBQ2QsU0FBQSxHQUFZO0lBQ1osUUFBQSxHQUFXLEdBQUcsQ0FBQyxLQUFKLENBQVUsUUFBVixDQUFtQixDQUFDLEdBQXBCLENBQXdCLFNBQUMsSUFBRCxFQUFPLFdBQVA7QUFDakMsVUFBQTtNQUFBLGNBQUEsR0FBaUI7TUFDakIsSUFBRyxTQUFIO1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWDtRQUNQLElBQUcsSUFBQSxJQUFTLFNBQUEsS0FBYSxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBUixHQUFpQixDQUExQztVQUNFLGNBQUEsR0FBaUI7VUFDakIsSUFBRyxTQUFBLElBQWMsQ0FBQyxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FBbEI7WUFDRSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxRQUFYLEVBQXFCLENBQXJCO1lBQ04sT0FBQSxHQUFVLEdBQUksQ0FBQSxDQUFBO1lBQ2QsSUFBQSxHQUFPLEdBQUksQ0FBQSxDQUFBO1lBQ1gsSUFBQSxHQUFPLE9BQUEsR0FBVSxHQUFWLEdBQWdCLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBQSxHQUFZLENBQXZCLENBQWhCLEdBQTRDLEdBQTVDLEdBQWtELFlBQUEsQ0FBYSxJQUFiO1lBQ3pELFNBQUEsR0FBWSxFQUxkOztVQU1BLFNBQUEsR0FBWSxFQVJkO1NBQUEsTUFBQTtBQVVFLGlCQUFPLEtBVlQ7U0FGRjs7TUFhQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxVQUFYO01BQ1AsSUFBRyxJQUFIO1FBQ0UsU0FBQSxHQUFZLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFSLEdBQWlCLEVBRC9COztNQUVBLElBQUcsQ0FBQyxjQUFKO1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQUE7UUFFUCxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFIVDs7TUFJQSxJQUFHLENBQUMsSUFBSSxDQUFDLE1BQVQ7QUFDRSxlQUFPLEdBRFQ7O01BRUEsUUFBQSxHQUFXO01BQ1gsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsaUJBQWIsRUFBZ0MsRUFBaEM7TUFFUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLEVBQXhCO01BRVAsSUFBRyxxQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxJQUEzQyxDQUFBLElBQXFELENBQUMsa0JBQWtCLENBQUMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBdEQsSUFBdUYsY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBdkYsSUFBcUgsQ0FBQyxXQUFXLENBQUMsSUFBWixDQUFpQixJQUFqQixDQUF0SCxJQUFnSixPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FBaEosSUFBdUssVUFBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBdkssSUFBaU0sQ0FBQyxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FBbE0sSUFBeU4sa0NBQWtDLENBQUMsSUFBbkMsQ0FBd0MsSUFBeEMsQ0FBek4sSUFBMlEsQ0FBQyxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FBL1E7UUFDRSxXQUFBLEdBQWMsV0FBQSxHQUFjLEVBRDlCO09BQUEsTUFFSyxJQUFHLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQWhCLENBQUEsSUFBeUIsaUJBQWlCLENBQUMsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBekIsSUFBeUQsa0JBQWtCLENBQUMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBekQsSUFBMEYsY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBMUYsSUFBd0gsUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkLENBQTNIO1FBQ0gsV0FBQSxHQUFjLEVBQUUsWUFEYjtPQUFBLE1BRUEsSUFBRyxTQUFTLENBQUMsSUFBVixDQUFlLElBQWYsQ0FBQSxJQUF3QixXQUFXLENBQUMsSUFBWixDQUFpQixJQUFqQixDQUEzQjtRQUNILFdBQUEsR0FBYztRQUNkLFdBQUEsR0FBYyxXQUFBLEdBQWMsRUFGekI7O01BR0wsU0FBQSxHQUFZLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYLENBQUEsSUFBcUIsRUFBdEIsQ0FBeUIsQ0FBQyxNQUExQixHQUFvQyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBWCxDQUFBLElBQXFCLEVBQXRCLENBQXlCLENBQUM7TUFFMUUsTUFBQSxHQUFTLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYLENBQUEsSUFBcUIsRUFBdEIsQ0FBeUIsQ0FBQyxNQUExQixHQUFvQyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBWCxDQUFBLElBQXFCLEVBQXRCLENBQXlCLENBQUM7TUFHdkUsSUFBRyxNQUFBLEdBQVMsQ0FBWjtRQUNFLFdBQUEsSUFBZSxPQURqQjs7TUFFQSxJQUFHLFNBQUEsR0FBWSxDQUFmO1FBQ0UsV0FBQSxJQUFlLFVBRGpCOztNQUVBLFdBQUEsSUFBZSxTQUFBLEdBQVk7TUFFM0IsSUFBRyxXQUFBLEdBQWMsV0FBZCxHQUE0QixDQUEvQjtRQUNFLFVBQUEsSUFBYyxXQUFBLEdBQWMsV0FBZCxHQUE0QjtRQUMxQyxXQUFBLEdBQWMsV0FBQSxHQUFjLENBQUEsR0FBSSxZQUZsQzs7TUFHQSxJQUFHLFdBQUEsR0FBYyxXQUFkLEdBQTRCLENBQUMsQ0FBN0IsSUFBbUMsVUFBQSxHQUFhLENBQW5EO1FBQ0UsVUFBQSxJQUFjLFdBQUEsR0FBYyxXQUFkLEdBQTRCO1FBQzFDLFdBQUEsR0FBYyxDQUFDLENBQUQsR0FBSyxZQUZyQjs7TUFHQSxJQUFHLFdBQUEsR0FBYyxXQUFqQjtRQUNFLFdBQUEsR0FBYyxZQURoQjs7TUFHQSxJQUEwRSxXQUFBLEdBQWMsQ0FBeEY7UUFBQSxPQUFBLENBQVEsK0JBQUEsR0FBa0MsV0FBbEMsR0FBOEMsSUFBOUMsR0FBa0QsUUFBMUQsRUFBQTs7TUFDQSxRQUFBLEdBQVcsQ0FBSSxRQUFRLENBQUMsTUFBVCxJQUFvQixXQUFBLEdBQWMsQ0FBbEMsSUFBd0MsQ0FBQyxjQUE1QyxHQUFnRSxNQUFNLENBQUMsTUFBUCxDQUFjLFdBQWQsQ0FBaEUsR0FBZ0csRUFBakcsQ0FBQSxHQUF1RztNQUNsSCxPQUFBLEdBQVUsV0FBQSxHQUFjLENBQWQsSUFBbUIsUUFBUSxDQUFDLE1BQVQsR0FBa0I7TUFDL0MsV0FBQSxHQUFjO01BQ2QsV0FBQSxHQUFjO01BQ2QsV0FBQSxHQUFjLFFBQVEsQ0FBQzthQUN2QixRQUFBLElBQVk7SUE5RHFCLENBQXhCO0lBZ0VYLElBQTZDLFdBQUEsR0FBYyxDQUEzRDtNQUFBLE9BQUEsQ0FBUSxpQ0FBUixFQUFBOztXQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsR0FBZDtFQTVFZTtBQTVCakIiLCJzb3VyY2VzQ29udGVudCI6WyJERUZBVUxUX0lOREVOVCA9ICcgICAgJ1xuXG5hZGp1c3Rfc3BhY2UgPSAobGluZSkgLT5cbiAgc3RyaW5nX2xpc3QgPSBsaW5lLm1hdGNoIC8oWydcIl0pW15cXDFdKj9cXDEvZ1xuICBtdWxpX3N0cmluZyA9IGxpbmUubWF0Y2ggL1xcWyg9KilcXFsoW15cXF1cXDFcXF1dKikvXG4gIGNvbW1lbnQgPSBsaW5lLm1hdGNoIC9cXC17Mn1bXlxcW10uKiQvXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UgL1xccysvZywgJyAnXG4gICMgcmVwbGFjZSBhbGwgd2hpdGVzcGFjZXMgaW5zaWRlIHRoZSBzdHJpbmcgd2l0aCBvbmUgc3BhY2UsIFdBUk5JTkc6IHRoZSB3aGl0ZXNwYWNlcyBpbiBzdHJpbmcgd2lsbCBiZSByZXBsYWNlIHRvbyFcbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvXFxzPyg9PXw+PXw8PXx+PXxbPT48XFwrXFwqXFwvXSlcXHM/L2csICcgJDEgJ1xuICAjIGFkZCB3aGl0ZXNwYWNlIGFyb3VuZCB0aGUgb3BlcmF0b3JcbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvKFtePWVcXC1cXChcXHNdKVxccz9cXC1cXHM/KFteXFwtXFxbXSkvZywgJyQxIC0gJDInXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UgLyhbXlxcZF0pZVxccz9cXC1cXHM/KFteXFwtXFxbXSkvZywgJyQxZSAtICQyJ1xuICAjIGp1c3QgZm9ybWF0IG1pbnVzLCBub3QgZm9yIC0tIG9yIG5lZ2F0aXZlIG51bWJlciBvciBjb21tZW50YXJ5LlxuICBsaW5lID0gbGluZS5yZXBsYWNlIC8sKFteXFxzXSkvZywgJywgJDEnXG4gICMgYWRqdXN0ICcsJ1xuICBsaW5lID0gbGluZS5yZXBsYWNlIC9cXHMrLC9nLCAnLCdcbiAgIyByZWNvdmVyIHRoZSB3aGl0ZXNwYWNlcyBpbiBzdHJpbmcuXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UgLyhbJ1wiXSlbXlxcMV0qP1xcMS9nLCAtPlxuICAgIHN0cmluZ19saXN0LnNoaWZ0KClcbiAgaWYgbXVsaV9zdHJpbmcgYW5kIG11bGlfc3RyaW5nWzBdXG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSAvXFxbKD0qKVxcWyhbXlxcXVxcMVxcXV0qKS8sIG11bGlfc3RyaW5nWzBdXG4gIGlmIGNvbW1lbnQgYW5kIGNvbW1lbnRbMF1cbiAgICBsaW5lID0gbGluZS5yZXBsYWNlIC9cXC17Mn1bXlxcW10uKiQvLCBjb21tZW50WzBdXG4gIGxpbmVcblxuREVGQVVMVF9XQVJOX0ZOID0gKG1zZykgLT5cbiAgY29uc29sZS5sb2coJ1dBUk5JTkc6JywgbXNnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChzdHIsIGluZGVudCwgd2Fybl9mbiwgb3B0cyA9IHt9KSAtPlxuICBlb2wgPSBvcHRzPy5lb2wgb3IgJ1xcbidcbiAgaW5kZW50ID0gaW5kZW50IG9yIERFRkFVTFRfSU5ERU5UXG4gIHdhcm5fZm4gPSBpZiB0eXBlb2Ygd2Fybl9mbiA9PSAnZnVuY3Rpb24nIHRoZW4gd2Fybl9mbiBlbHNlIERFRkFVTFRfV0FSTl9GTlxuICBpbmRlbnQgPSAnICcucmVwZWF0KGluZGVudCkgaWYgTnVtYmVyLmlzSW50ZWdlcihpbmRlbnQpXG4gICRjdXJySW5kZW50ID0gMFxuICAkbmV4dEluZGVudCA9IDBcbiAgJHByZXZMZW5ndGggPSAwXG4gICRleHRJbmRlbnQgPSAwXG4gICRsYXN0SW5kZW50ID0gMFxuICAkdGVtcGxhdGUgPSAwXG4gIG5ld19jb2RlID0gc3RyLnNwbGl0KC9cXHI/XFxuL2cpLm1hcCAobGluZSwgbGluZV9udW1iZXIpIC0+XG4gICAgJHRlbXBsYXRlX2ZsYWcgPSBmYWxzZVxuICAgIGlmICR0ZW1wbGF0ZVxuICAgICAgcmVzMiA9IGxpbmUubWF0Y2goL1xcXSg9KilcXF0vKVxuICAgICAgaWYgcmVzMiBhbmQgJHRlbXBsYXRlID09IHJlczJbMV0ubGVuZ3RoICsgMVxuICAgICAgICAkdGVtcGxhdGVfZmxhZyA9IHRydWVcbiAgICAgICAgaWYgJHRlbXBsYXRlIGFuZCAhL109Kl0kLy50ZXN0KGxpbmUpXG4gICAgICAgICAgYXJyID0gbGluZS5zcGxpdCgvXFxdPSpcXF0vLCAyKVxuICAgICAgICAgIGNvbW1lbnQgPSBhcnJbMF1cbiAgICAgICAgICBjb2RlID0gYXJyWzFdXG4gICAgICAgICAgbGluZSA9IGNvbW1lbnQgKyAnXScgKyAnPScucmVwZWF0KCR0ZW1wbGF0ZSAtIDEpICsgJ10nICsgYWRqdXN0X3NwYWNlKGNvZGUpXG4gICAgICAgICAgJHRlbXBsYXRlID0gMFxuICAgICAgICAkdGVtcGxhdGUgPSAwXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBsaW5lXG4gICAgcmVzMSA9IGxpbmUubWF0Y2goL1xcWyg9KilcXFsvKVxuICAgIGlmIHJlczFcbiAgICAgICR0ZW1wbGF0ZSA9IHJlczFbMV0ubGVuZ3RoICsgMVxuICAgIGlmICEkdGVtcGxhdGVfZmxhZ1xuICAgICAgbGluZSA9IGxpbmUudHJpbSgpXG4gICAgICAjIHJlbW90ZSBhbGwgc3BhY2VzIG9uIGJvdGggZW5kc1xuICAgICAgbGluZSA9IGFkanVzdF9zcGFjZShsaW5lKVxuICAgIGlmICFsaW5lLmxlbmd0aFxuICAgICAgcmV0dXJuICcnXG4gICAgcmF3X2xpbmUgPSBsaW5lXG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvKFsnXCJdKVteXFwxXSo/XFwxLywgJycpXG4gICAgIyByZW1vdmUgYWxsIHF1b3RlZCBmcmFnbWVudHMgZm9yIHByb3BlciBicmFja2V0IHByb2Nlc3NpbmdcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHMqLS0uKy8sICcnKVxuICAgICMgcmVtb3ZlIGFsbCBjb21tZW50czsgdGhpcyBpZ25vcmVzIGxvbmcgYnJhY2tldCBzdHlsZSBjb21tZW50c1xuICAgIGlmIC9eKChsb2NhbCApP2Z1bmN0aW9ufHJlcGVhdHx3aGlsZSlcXGIvLnRlc3QobGluZSkgYW5kICEvXFxiZW5kXFxzKltcXCksO10qJC8udGVzdChsaW5lKSBvciAvXFxiKHRoZW58ZG8pJC8udGVzdChsaW5lKSBhbmQgIS9eZWxzZWlmXFxiLy50ZXN0KGxpbmUpIG9yIC9eaWZcXGIvLnRlc3QobGluZSkgYW5kIC9cXGJ0aGVuXFxiLy50ZXN0KGxpbmUpIGFuZCAhL1xcYmVuZCQvLnRlc3QobGluZSkgb3IgL1xcYmZ1bmN0aW9uID8oPzpcXHcrICk/XFwoW15cXCldKlxcKSQvLnRlc3QobGluZSkgYW5kICEvXFxiZW5kJC8udGVzdChsaW5lKVxuICAgICAgJG5leHRJbmRlbnQgPSAkY3VyckluZGVudCArIDFcbiAgICBlbHNlIGlmIC9edW50aWxcXGIvLnRlc3QobGluZSkgb3IgL15lbmRcXHMqW1xcKSw7XSokLy50ZXN0KGxpbmUpIG9yIC9eZW5kXFxzKlxcKVxccypcXC5cXC4vLnRlc3QobGluZSkgb3IgL15lbHNlKGlmKT9cXGIvLnRlc3QobGluZSkgYW5kIC9cXGJlbmQkLy50ZXN0KGxpbmUpXG4gICAgICAkbmV4dEluZGVudCA9IC0tJGN1cnJJbmRlbnRcbiAgICBlbHNlIGlmIC9eZWxzZVxcYi8udGVzdChsaW5lKSBvciAvXmVsc2VpZlxcYi8udGVzdChsaW5lKVxuICAgICAgJG5leHRJbmRlbnQgPSAkY3VyckluZGVudFxuICAgICAgJGN1cnJJbmRlbnQgPSAkY3VyckluZGVudCAtIDFcbiAgICAkYnJhY2tldHMgPSAobGluZS5tYXRjaCgvXFwoL2cpIG9yIFtdKS5sZW5ndGggLSAoKGxpbmUubWF0Y2goL1xcKS9nKSBvciBbXSkubGVuZ3RoKVxuICAgICMgY2FwdHVyZSB1bmJhbGFuY2VkIGJyYWNrZXRzXG4gICAgJGN1cmx5ID0gKGxpbmUubWF0Y2goL1xcey9nKSBvciBbXSkubGVuZ3RoIC0gKChsaW5lLm1hdGNoKC9cXH0vZykgb3IgW10pLmxlbmd0aClcbiAgICAjIGNhcHR1cmUgdW5iYWxhbmNlZCBjdXJseSBicmFja2V0c1xuICAgICMgY2xvc2UgKGN1cmx5KSBicmFja2V0cyBpZiBuZWVkZWRcbiAgICBpZiAkY3VybHkgPCAwXG4gICAgICAkY3VyckluZGVudCArPSAkY3VybHlcbiAgICBpZiAkYnJhY2tldHMgPCAwXG4gICAgICAkY3VyckluZGVudCArPSAkYnJhY2tldHNcbiAgICAkbmV4dEluZGVudCArPSAkYnJhY2tldHMgKyAkY3VybHlcbiAgICAjIGNvbnNvbGUubG9nKHtsYXN0OiAkbGFzdEluZGVudCwgY3VycjogJGN1cnJJbmRlbnQsIG5leHQ6ICRuZXh0SW5kZW50LCBleHQ6ICRleHRJbmRlbnR9KVxuICAgIGlmICRjdXJySW5kZW50IC0gJGxhc3RJbmRlbnQgPiAxXG4gICAgICAkZXh0SW5kZW50ICs9ICRuZXh0SW5kZW50IC0gJGxhc3RJbmRlbnQgLSAxXG4gICAgICAkbmV4dEluZGVudCA9ICRjdXJySW5kZW50ID0gMSArICRsYXN0SW5kZW50XG4gICAgaWYgJGN1cnJJbmRlbnQgLSAkbGFzdEluZGVudCA8IC0xIGFuZCAkZXh0SW5kZW50ID4gMFxuICAgICAgJGV4dEluZGVudCArPSAkY3VyckluZGVudCAtICRsYXN0SW5kZW50ICsgMVxuICAgICAgJGN1cnJJbmRlbnQgPSAtMSArICRsYXN0SW5kZW50XG4gICAgaWYgJG5leHRJbmRlbnQgPCAkY3VyckluZGVudFxuICAgICAgJG5leHRJbmRlbnQgPSAkY3VyckluZGVudFxuICAgICMgY29uc29sZS5sb2coe2xhc3Q6ICRsYXN0SW5kZW50LCBjdXJyOiAkY3VyckluZGVudCwgbmV4dDogJG5leHRJbmRlbnQsIGV4dDogJGV4dEluZGVudH0pXG4gICAgd2Fybl9mbiBcIlwiXCJuZWdhdGl2ZSBpbmRlbnRhdGlvbiBhdCBsaW5lICN7bGluZV9udW1iZXJ9OiAje3Jhd19saW5lfVwiXCJcIiBpZiAkY3VyckluZGVudCA8IDBcbiAgICBuZXdfbGluZSA9IChpZiByYXdfbGluZS5sZW5ndGggYW5kICRjdXJySW5kZW50ID4gMCBhbmQgISR0ZW1wbGF0ZV9mbGFnIHRoZW4gaW5kZW50LnJlcGVhdCgkY3VyckluZGVudCkgZWxzZSAnJykgKyByYXdfbGluZVxuICAgICR1c2VmdWwgPSAkcHJldkxlbmd0aCA+IDAgb3IgcmF3X2xpbmUubGVuZ3RoID4gMFxuICAgICRsYXN0SW5kZW50ID0gJGN1cnJJbmRlbnRcbiAgICAkY3VyckluZGVudCA9ICRuZXh0SW5kZW50XG4gICAgJHByZXZMZW5ndGggPSByYXdfbGluZS5sZW5ndGhcbiAgICBuZXdfbGluZSBvciB1bmRlZmluZWRcblxuICB3YXJuX2ZuICdwb3NpdGl2ZSBpbmRlbnRhdGlvbiBhdCB0aGUgZW5kJyBpZiAkY3VyckluZGVudCA+IDBcbiAgbmV3X2NvZGUuam9pbiBlb2xcbiJdfQ==
