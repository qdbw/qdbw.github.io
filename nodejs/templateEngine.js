/*
  Ejssel
  The Ejssel Web Template Engine. For QDBw's site generating.
  aka. qdbw-template-engine, QwE ,EJS--,Qw Engine

  This file contains the source code of Ejssel engine.

  2024 Soloev
  All rights reserved.

  Published under GNU Public License v3.0

  Programming language: ECMAScript >= 2015

  The name Ejssel comes from 'EJS' and 'Less' reversed.
*/

/*
  Quick learning of Ejssel
    It's just like writing HTML, but with some template-based features, like:

    <if condition>
        <tags1>
    <elif another_condition>
        <tags2>
    <else>
        <tags2>
    </if>

    This will be converted into:

    if(condition ?? false) {
        Replace with <tags1>
    } else if (another_condition ?? false) {
        Replace with <tags2>
    } else {
        Replace with <tags3>
    }
    
    <each valueInObj:object>
        <tags>
    </each>

    Will be converted into:

    for(let [key,valueInObj] of Object.entries(object ?? {})){
        <tags>
    }

    Note that `key` is auto added.
    The </each> and </if> can be replaced with <end>

    Elite usage (for quick-writing)

    <?> == <if>
    <??> == <elif>
    <?!> == <else>
    </?>,</%>,</~>,</$> == </if>,</each>,<end>
*/

const QwE_DEBUG_SYMBOL = false; // Set this symbol-variant to true to enable debug-logging.

const DEBUG = (...data) => {
    if (QwE_DEBUG_SYMBOL)
        console.log(...data);
}

class Ejssel {
    static parse(template, variants) {
        const $ = variants; // DO NOT REMOVE THESE 2 LINES! 
        let str = ``; // THEY ARE USED IN EVALUATE FUNCTION!
        str; $;
        let processedTemplate = '';
        DEBUG('[LOG] [Ejssel] Building Template. Binding variants.');
        DEBUG('[LOG] [Ejssel] Variants need to be binded:', Object.keys($));
        for (let k of Object.keys($)) {
            DEBUG('[LOG] [Ejssel] Binding ', k);
            processedTemplate += `const ${k} = $.${k};\n`;
        }
        processedTemplate += "{ str += `";
        template = template
            .replace(/`/g,'\\`')
            .replace(/<%#.*?%>/g, '')
            .replace(/<~ *?(.+?) *?>/g, "${$1 ?? ''}")
            .replace(/<\$?each +?(.*?):(.*?) *?>/g, '`; for(let [key,$1] of Object.entries($2 ?? {})){ str+=`')
            .replace(/<\$?if +?(.*?) *?>/g, '`;if(($1) ?? false){ str+=`')
            .replace(/<\$?elif +?(.*?) *?>/g, '`} else if(($1) ?? false){ str+=`')
            .replace(/<\$?else *?>/g, '`} else { str+=`')
            .replace(/<\$?\/each *?>/g, '`;} str+=`')
            .replace(/<\$?\/if *?>/g, '`;} str+=`')
            .replace(/<\$?end *?>/g, '`;} str+=`') // QwE grammar.
            .replace(/<%?\+ +?(.*?):(.*?) *?%?>/g, '`; for(let [key,$1] of Object.entries($2 ?? {})){ str+=`')
            .replace(/<%?\? +?(.*?) *?%?>/g, '`;if(($1) ?? false){ str+=`')
            .replace(/<%?\?\? +?(.+?) *?%?>/g, '`} else if(($1) ?? false){ str+=`')
            .replace(/<%?\??\! *?%?>/g, '`} else { str+=`')
            .replace(/<\/[%$~?] *?>/g, '`;} str+=`') // QwElite grammar. Use with caution.
            .replace(/<%= *?(.+?) *?%>/g, "${$1 ?? ''}")
            .replace(/<% *?([^\n]*?) *?%>/g, '`;$1\nstr+=`')
            .replace(/<%%/g, '<%') // Some basic EJS grammar. <EJS IS NOT FULLY SUPPORTED>
            .replace(/str\+=`\s+?`/g, ""); // Remove unnessary white line.
        processedTemplate += template;
        processedTemplate += '`}';
        DEBUG('[LOG] [Ejssel] Template parsed. Start building.');
        try {
            let processedResult = eval(processedTemplate);
            processedResult = processedResult
            .replace(/>\s*?\n\s*?</g,'><')
            .replace(/>\s+?(\S)/g,'>$1')
            .replace(/(\S)\s+?</g,'$1<');
            return processedResult;
        } catch (e) {
            DEBUG('[CATCH] [Ejssel] Template: \n',processedTemplate);
            console.error('[ERROR] [Ejssel] Cannot parse template!');
            console.error(e);
            return '';
        }
    }
}

export default Ejssel;