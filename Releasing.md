# Releasing

I first configure to Git to also push all tags when executing a ```git push```
```
git config --global push.followTags true
```

To create a new release execute the following steps:

```
git add .
git commit -m "travis config change"
git push
npm version 0.0.6 -m "Upgrade to %s"
```

This should also bump a new version to npmjs.org




Deploying a new version from npm

```
sudo npm uninstall web-gpio-react -g
rm -rf ~/.npm/web-gpio-react/
sudo npm install web-gpio-react -g
```

## Some tools

List all globally installed packages

```
npm list --depth=0 -g
```

List current installed version of package

```
npm view web-gpio-react version
0.0.10
```

List all versions of package

```
npm view web-gpio-react versions
[ '0.0.2', '0.0.3', '0.0.8', '0.0.9', '0.0.10', '0.1.0-alpha1' ]
```




## Alpha versions

npm version 0.1.0-alpha1 -m "Prepping alpha version %s"


## References

http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
http://www.jayway.com/2014/03/28/running-scripts-with-npm/
https://gist.github.com/AvnerCohen/4051934
http://carrot.is/coding/npm_prerelease
https://gist.github.com/coolaj86/1318304
