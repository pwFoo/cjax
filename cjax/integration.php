<?php


// Function to remove folders and files
function rrmdir($dir) {
    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $file)
            if ($file != "." && $file != "..") rrmdir("$dir/$file");
        rmdir($dir);
    }
    else if (file_exists($dir)) unlink($dir);
}

// Function to Copy folders and files
function rcopy($src, $dst, $rm = false) {
    if (file_exists ( $dst ))
        !$rm ||  rrmdir ( $dst );
    if (is_dir ( $src )) {
        is_dir($dst) || mkdir ( $dst );
        $files = scandir ( $src );
        foreach ( $files as $file )
            if ($file != "." && $file != "..")
                rcopy ( "$src/$file", "$dst/$file" );
    } else if (file_exists ( $src ))
        copy ( $src, $dst );
}

$cwd = getcwd();

if(is_file('composer.json')) {
    $composer = json_decode(file_get_contents('composer.json'));
    if($composer->name == 'codeigniter/framework') {

        rcopy('cjax/','application/libraries/cjax');
        rcopy('cjax/integration/codeigniter/application/','application/');

        copy('cjax/integration/default/ajax.php','application/libraries/ajax.php');
        copy('application/libraries/cjax/integration/codeigniter/integration.php','ajax.php');


        unlink(__FILE__);
        exit(header("Location: ajax.php"));
    }
}