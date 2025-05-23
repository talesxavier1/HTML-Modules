"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var MonacoAceTokenizer = require('monaco-ace-tokenizer');

var oop = MonacoAceTokenizer.oop;
var TextHighlightRules = MonacoAceTokenizer.TextHighlightRules;

var JuliaHighlightRules = function JuliaHighlightRules() {
  this.$rules = {
    start: [{
      include: '#function_decl'
    }, {
      include: '#function_call'
    }, {
      include: '#type_decl'
    }, {
      include: '#keyword'
    }, {
      include: '#operator'
    }, {
      include: '#number'
    }, {
      include: '#string'
    }, {
      include: '#comment'
    }],
    '#bracket': [{
      token: 'keyword.bracket.julia',
      regex: '\\(|\\)|\\[|\\]|\\{|\\}|,'
    }],
    '#comment': [{
      token: ['punctuation.definition.comment.julia', 'comment.line.number-sign.julia'],
      regex: '(#)(?!\\{)(.*$)'
    }],
    '#function_call': [{
      token: ['support.function.julia', 'text'],
      regex: "([a-zA-Z0-9_]+!?)([\\w\\xff-\\u218e\\u2455-\\uffff]*\\()"
    }],
    '#function_decl': [{
      token: ['keyword.other.julia', 'meta.function.julia', 'entity.name.function.julia', 'meta.function.julia', 'text'],
      regex: "(function|macro)(\\s*)([a-zA-Z0-9_\\{]+!?)([\\w\\xff-\\u218e\\u2455-\\uffff]*)([(\\\\{])"
    }],
    '#keyword': [{
      token: 'keyword.other.julia',
      regex: '\\b(?:function|type|immutable|macro|quote|abstract|bitstype|typealias|module|baremodule|new)\\b'
    }, {
      token: 'keyword.control.julia',
      regex: '\\b(?:if|else|elseif|while|for|in|begin|let|end|do|try|catch|finally|return|break|continue)\\b'
    }, {
      token: 'storage.modifier.variable.julia',
      regex: '\\b(?:global|local|const|export|import|importall|using)\\b'
    }, {
      token: 'variable.macro.julia',
      regex: "@[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b"
    }],
    '#number': [{
      token: 'constant.numeric.julia',
      regex: '\\b0(?:x|X)[0-9a-fA-F]*|(?:\\b[0-9]+\\.?[0-9]*|\\.[0-9]+)(?:(?:e|E)(?:\\+|-)?[0-9]*)?(?:im)?|\\bInf(?:32)?\\b|\\bNaN(?:32)?\\b|\\btrue\\b|\\bfalse\\b'
    }],
    '#operator': [{
      token: 'keyword.operator.update.julia',
      regex: '=|:=|\\+=|-=|\\*=|/=|//=|\\.//=|\\.\\*=|\\\\=|\\.\\\\=|^=|\\.^=|%=|\\|=|&=|\\$=|<<=|>>='
    }, {
      token: 'keyword.operator.ternary.julia',
      regex: '\\?|:'
    }, {
      token: 'keyword.operator.boolean.julia',
      regex: '\\|\\||&&|!'
    }, {
      token: 'keyword.operator.arrow.julia',
      regex: '->|<-|-->'
    }, {
      token: 'keyword.operator.relation.julia',
      regex: '>|<|>=|<=|==|!=|\\.>|\\.<|\\.>=|\\.>=|\\.==|\\.!=|\\.=|\\.!|<:|:>'
    }, {
      token: 'keyword.operator.range.julia',
      regex: ':'
    }, {
      token: 'keyword.operator.shift.julia',
      regex: '<<|>>'
    }, {
      token: 'keyword.operator.bitwise.julia',
      regex: '\\||\\&|~'
    }, {
      token: 'keyword.operator.arithmetic.julia',
      regex: '\\+|-|\\*|\\.\\*|/|\\./|//|\\.//|%|\\.%|\\\\|\\.\\\\|\\^|\\.\\^'
    }, {
      token: 'keyword.operator.isa.julia',
      regex: '::'
    }, {
      token: 'keyword.operator.dots.julia',
      regex: '\\.(?=[a-zA-Z])|\\.\\.+'
    }, {
      token: 'keyword.operator.interpolation.julia',
      regex: '\\$#?(?=.)'
    }, {
      token: ['variable', 'keyword.operator.transposed-variable.julia'],
      regex: "([\\w\\xff-\\u218e\\u2455-\\uffff]+)((?:'|\\.')*\\.?')"
    }, {
      token: 'text',
      regex: '\\[|\\('
    }, {
      token: ['text', 'keyword.operator.transposed-matrix.julia'],
      regex: "([\\]\\)])((?:'|\\.')*\\.?')"
    }],
    '#string': [{
      token: 'punctuation.definition.string.begin.julia',
      regex: '\'',
      push: [{
        token: 'punctuation.definition.string.end.julia',
        regex: '\'',
        next: 'pop'
      }, {
        include: '#string_escaped_char'
      }, {
        defaultToken: 'string.quoted.single.julia'
      }]
    }, {
      token: 'punctuation.definition.string.begin.julia',
      regex: '"',
      push: [{
        token: 'punctuation.definition.string.end.julia',
        regex: '"',
        next: 'pop'
      }, {
        include: '#string_escaped_char'
      }, {
        defaultToken: 'string.quoted.double.julia'
      }]
    }, {
      token: 'punctuation.definition.string.begin.julia',
      regex: "\\b[\\w\\xff-\\u218e\\u2455-\\uffff]+\"",
      push: [{
        token: 'punctuation.definition.string.end.julia',
        regex: "\"[\\w\\xff-\\u218e\\u2455-\\uffff]*",
        next: 'pop'
      }, {
        include: '#string_custom_escaped_char'
      }, {
        defaultToken: 'string.quoted.custom-double.julia'
      }]
    }, {
      token: 'punctuation.definition.string.begin.julia',
      regex: '`',
      push: [{
        token: 'punctuation.definition.string.end.julia',
        regex: '`',
        next: 'pop'
      }, {
        include: '#string_escaped_char'
      }, {
        defaultToken: 'string.quoted.backtick.julia'
      }]
    }],
    '#string_custom_escaped_char': [{
      token: 'constant.character.escape.julia',
      regex: '\\\\"'
    }],
    '#string_escaped_char': [{
      token: 'constant.character.escape.julia',
      regex: '\\\\(?:\\\\|[0-3]\\d{,2}|[4-7]\\d?|x[a-fA-F0-9]{,2}|u[a-fA-F0-9]{,4}|U[a-fA-F0-9]{,8}|.)'
    }],
    '#type_decl': [{
      token: ['keyword.control.type.julia', 'meta.type.julia', 'entity.name.type.julia', 'entity.other.inherited-class.julia', 'punctuation.separator.inheritance.julia', 'entity.other.inherited-class.julia'],
      regex: '(type|immutable)(\\s+)([a-zA-Z0-9_]+)(?:(\\s*)(<:)(\\s*[.a-zA-Z0-9_:]+))?'
    }, {
      token: ['other.typed-variable.julia', 'support.type.julia'],
      regex: '([a-zA-Z0-9_]+)(::[a-zA-Z0-9_{}]+)'
    }]
  };
  this.normalizeRules();
};

JuliaHighlightRules.metaData = {
  fileTypes: ['jl'],
  firstLineMatch: '^#!.*\\bjulia\\s*$',
  foldingStartMarker: '^\\s*(?:if|while|for|begin|function|macro|module|baremodule|type|immutable|let)\\b(?!.*\\bend\\b).*$',
  foldingStopMarker: '^\\s*(?:end)\\b.*$',
  name: 'Julia',
  scopeName: 'source.julia'
};
oop.inherits(JuliaHighlightRules, TextHighlightRules);
var _default = JuliaHighlightRules;
exports["default"] = _default;