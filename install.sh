#!/bin/bash

DEST="$HOME"
DOTS="$HOME/.dotfiles"

atom_symlink() {
  #echo "$DEST"
  #echo "$DOTS"

  for file in $DOTS/atom.symlink/*; do
    echo "Symlink $file..."
    ln -sfn "$file" "$DEST/.atom"
  done
}

atom_symlink "$@"
