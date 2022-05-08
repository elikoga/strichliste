{ callPackage
, stdenv
, nodejs
, VITE_CURRENCY_SYMBOL ? null
, VITE_CURRENCY_DECIMALS ? null
, VITE_CURRENCY_IS_PREFIXED ? null
, VITE_LANGUAGE ? null
, VITE_MIGRATIONS_DIR ? null
}:
let
  nodeComposition = (callPackage ./node-composition.nix { });
  nodeDependencies = nodeComposition.nodeDependencies;
  version = nodeComposition.package.version;
in
stdenv.mkDerivation {
  pname = "strichliste";
  version = version;
  src = ./.;
  buildInputs = [ nodejs ];
  preConfigure =
    (if VITE_CURRENCY_SYMBOL != null
    then "export VITE_CURRENCY_SYMBOL=\"${VITE_CURRENCY_SYMBOL}\"\n"
    else "") +
    (if VITE_CURRENCY_DECIMALS != null
    then "export VITE_CURRENCY_DECIMALS=\"${toString VITE_CURRENCY_DECIMALS}\"\n"
    else "") +
    (if VITE_CURRENCY_IS_PREFIXED != null
    then "export VITE_CURRENCY_IS_PREFIXED=\"${VITE_CURRENCY_IS_PREFIXED}\"\n"
    else "") +
    (if VITE_LANGUAGE != null
    then "export VITE_LANGUAGE=\"${VITE_LANGUAGE}\"\n"
    else "") +
    (if VITE_MIGRATIONS_DIR != null
    then "export VITE_MIGRATIONS_DIR=\"${VITE_MIGRATIONS_DIR}\"\n"
    else "export VITE_MIGRATIONS_DIR=\"$out/lib/strichliste/migrations\"\n");
  ;
  buildPhase = ''
    ln -s ${nodeDependencies}/lib/node_modules ./node_modules
    export PATH="${nodeDependencies}/bin:$PATH"

    npm run build
  '';
  installPhase = ''
    mkdir -p $out/lib/strichliste
    cp -r build/* $out/lib/strichliste/
    cp -r migrations $out/lib/strichliste/
    cp package.json $out/lib/strichliste
    ln -s ${nodeDependencies}/lib/node_modules $out/lib/strichliste/node_modules

    # add executable
    mkdir -p $out/bin
    cat > $out/bin/strichliste <<EOF
    #!${stdenv.shell}
    exec ${nodejs}/bin/node $out/lib/strichliste $@
    EOF
    chmod +x $out/bin/strichliste
  '';
}
