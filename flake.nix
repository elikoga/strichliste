{
  description = "Strichliste";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs =
    { self
    , nixpkgs
    , utils
    , ...
    }@args:
    utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in
    rec {
      packages = rec {
        strichliste = pkgs.callPackage ./strichliste.nix { };
        default = strichliste;
        strichliste-en-dollar = pkgs.callPackage ./strichliste.nix {
          VITE_CURRENCY_SYMBOL = "$";
          VITE_CURRENCY_DECIMALS = 2;
          VITE_CURRENCY_IS_PREFIXED = "true";
          VITE_LANGUAGE = "en";
        };
      };

      devShells.default = pkgs.mkShell {
        inputsFrom = [ packages.default ];
        packages = [
          pkgs.nodePackages.node2nix
          pkgs.nodejs
        ];
      };

      apps = rec {
        strichliste = {
          type = "app";
          program = "${packages.strichliste}/bin/strichliste";
        };
        default = strichliste;
        strichliste-en-dollar = {
          type = "app";
          program = "${packages.strichliste-en-dollar}/bin/strichliste";
        };
      };
    });
}
