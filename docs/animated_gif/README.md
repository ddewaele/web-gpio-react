Check if imagemagick is installed. If not execute the following command:

```
brew install imagemagick
```

Convert these file to an animated GIF using

```
convert -delay 30 -loop 0  ./input/* ./output/output.gif
```

```
convert do.gif -coalesce temporary.gif
```

```
convert -size <original size> temporary.gif -resize 24x24 smaller.gif
```