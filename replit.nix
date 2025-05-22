{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.nodePackages.pnpm # In case it's needed by Replit or future deps
  ];
}
