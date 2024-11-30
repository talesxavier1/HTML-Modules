import { TMonacoLanguage } from "Types/TMonacoLanguage";
import { TMonacoExtension } from "../Types/TMonacoExtension";


export class LanguageStore {
    private static data = {
        "css": [
            ".css"
        ],
        "html": [
            ".html"
        ],
        "json": [
            ".json"
        ],
        "typescript": [
            ".ts",
            ".d.ts"
        ],
        "abap": [
            ".abap"
        ],
        "apex": [
            ".cls"
        ],
        "azcli": [
            ".azcli"
        ],
        "bat": [
            ".bat"
        ],
        "bicep": [
            ".bicep"
        ],
        "cameligo": [
            ".mligo"
        ],
        "clojure": [
            ".clj"
        ],
        "coffee": [
            ".coffee"
        ],
        "cpp": [
            ".cpp",
            ".cc",
            ".cxx"
        ],
        "csharp": [
            ".cs"
        ],
        "csp": [
            ".csp"
        ],
        "cypher": [
            ".cql"
        ],
        "dart": [
            ".dart"
        ],
        "dockerfile": [
            "Dockerfile"
        ],
        "ecl": [
            ".ecl"
        ],
        "elixir": [
            ".ex",
            ".exs"
        ],
        "flow9": [
            ".flow"
        ],
        "freemarker2": [
            ".ftl"
        ],
        "fsharp": [
            ".fs",
            ".fsi",
            ".fsx"
        ],
        "go": [
            ".go"
        ],
        "graphql": [
            ".graphql",
            ".gql"
        ],
        "handlebars": [
            ".hbs",
            ".handlebars"
        ],
        "hcl": [
            ".hcl",
            ".tf"
        ],
        "ini": [
            ".ini"
        ],
        "java": [
            ".java"
        ],
        "javascript": [
            ".js"
        ],
        "julia": [
            ".jl"
        ],
        "kotlin": [
            ".kt",
            ".kts"
        ],
        "less": [
            ".less"
        ],
        "lexon": [
            ".lex"
        ],
        "liquid": [
            ".liquid"
        ],
        "lua": [
            ".lua"
        ],
        "m3": [
            ".m3"
        ],
        "markdown": [
            ".md",
            ".markdown"
        ],
        "mdx": [
            ".mdx"
        ],
        "mips": [
            ".s",
            ".asm"
        ],
        "msdax": [
            ".msdax"
        ],
        "mysql": [
            ".sql"
        ],
        "objective-c": [
            ".m",
            ".mm"
        ],
        "pascal": [
            ".pas",
            ".pp"
        ],
        "pascaligo": [
            ".ligo"
        ],
        "perl": [
            ".pl",
            ".pm"
        ],
        "pgsql": [
            ".sql"
        ],
        "php": [
            ".php"
        ],
        "pla": [
            ".pla"
        ],
        "postiats": [
            ".dats",
            ".sats",
            ".hats"
        ],
        "powerquery": [
            ".pq"
        ],
        "powershell": [
            ".ps1",
            ".psm1"
        ],
        "protobuf": [
            ".proto"
        ],
        "pug": [
            ".pug"
        ],
        "python": [
            ".py"
        ],
        "qsharp": [
            ".qs"
        ],
        "r": [
            ".r"
        ],
        "razor": [
            ".cshtml"
        ],
        "redis": [
            ".redis"
        ],
        "redshift": [
            ".sql"
        ],
        "restructuredtext": [
            ".rst"
        ],
        "ruby": [
            ".rb"
        ],
        "rust": [
            ".rs"
        ],
        "sb": [
            ".sb"
        ],
        "scala": [
            ".scala"
        ],
        "scheme": [
            ".scm",
            ".ss"
        ],
        "scss": [
            ".scss"
        ],
        "shell": [
            ".sh"
        ],
        "solidity": [
            ".sol"
        ],
        "sophia": [
            ".aes"
        ],
        "sparql": [
            ".sparql"
        ],
        "sql": [
            ".sql"
        ],
        "st": [
            ".st"
        ],
        "swift": [
            ".swift"
        ],
        "systemverilog": [
            ".sv",
            ".svh"
        ],
        "tcl": [
            ".tcl"
        ],
        "twig": [
            ".twig"
        ],
        "typespec": [
            ".tsp"
        ],
        "vb": [
            ".vb"
        ],
        "wgsl": [
            ".wgsl"
        ],
        "xml": [
            ".xml"
        ],
        "yaml": [
            ".yaml",
            ".yml"
        ],
        "groovy": [
            ".groovy"
        ]
    };


    static getLenguageFromFileName = (fileName: string): TMonacoLanguage => {
        let dataKeys: Array<TMonacoLanguage> = Object.keys(this.data) as Array<TMonacoLanguage>;
        let language: TMonacoLanguage = dataKeys.find(VALUE => {
            let extensionsLanguage: Array<TMonacoExtension> = this.data[VALUE] as Array<TMonacoExtension>;
            return extensionsLanguage.some(VALUE_SOME => fileName.indexOf(VALUE_SOME) > -1)
        }) as TMonacoLanguage;
        if (!language) {
            throw new Error(`[ERRO]-[LanguageStore] Não foi possível encontrar linguagem para o arquivo "${fileName}"`);
        }
        return language;
    }
}