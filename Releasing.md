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

List all globally installed packages

```
npm list --depth=0 -g
```