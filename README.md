### Issues and Resolutions

Following are the issues and their resolutions faced during the development.

**Can't resolve symbol android.support.v4.util.Pools in react-native-gesture-handler**

The jetifier is an AndroidX transition tool in npm format, with a react-native compatible style.

```
npm i jetifier
npx jetify
```

**Possible Unhandled Promise Rejection**

Trying to use `AsyncStorage.setItem('key', 'non string value')` which was throwing the exception in the first place. And as I was not catching the exception anywhere in my code it was showing me the warning. After implementing below fix, the warning went away.

```
AsyncStorage.setItem('accessToken', data.accessToken)
            .then( () => AsyncStorage.setItem('loggedInUser', JSON.stringify(data.user) ))
            .catch( (error) => console.log("Error persisting data:", error) );
```

**Update the Java Build**

`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`

**Emulator crashes frequently**

```
07-14 20:59:10.182  7153  7153 E AndroidRuntime: FATAL EXCEPTION: main
07-14 20:59:10.182  7153  7153 E AndroidRuntime: Process: com.counterclinicmobile, PID: 7153
07-14 20:59:10.182  7153  7153 E AndroidRuntime: com.facebook.react.bridge.NoSuchKeyException: label
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at com.facebook.react.bridge.ReadableNativeMap.getNullableValue(ReadableNativeMap.java:124)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at com.facebook.react.bridge.ReadableNativeMap.getNullableValue(ReadableNativeMap.java:128)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at com.facebook.react.bridge.ReadableNativeMap.getString(ReadableNativeMap.java:163)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at com.facebook.react.views.picker.ReactPickerManager$ReactPickerAdapter.getView(ReactPickerManager.java:126)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at com.facebook.react.views.picker.ReactPickerManager$ReactPickerAdapter.getDropDownView(ReactPickerManager.java:112)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.widget.Spinner$DropDownAdapter.getDropDownView(Spinner.java:994)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.widget.Spinner$DropDownAdapter.getView(Spinner.java:990)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.widget.Spinner.measureContentWidth(Spinner.java:856)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.widget.Spinner$DropdownPopup.computeContentWidth(Spinner.java:1225)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.widget.Spinner$DropdownPopup.show(Spinner.java:1251)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.widget.Spinner.performClick(Spinner.java:780)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at androidx.appcompat.widget.AppCompatSpinner.performClick(AppCompatSpinner.java:443)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.view.View.performClickInternal(View.java:6574)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.view.View.access$3100(View.java:778)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.view.View$PerformClick.run(View.java:25885)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.os.Handler.handleCallback(Handler.java:873)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.os.Handler.dispatchMessage(Handler.java:99)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.os.Looper.loop(Looper.java:193)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at android.app.ActivityThread.main(ActivityThread.java:6669)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at java.lang.reflect.Method.invoke(Native Method)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:493)
07-14 20:59:10.182  7153  7153 E AndroidRuntime:        at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:858)
07-14 20:59:10.186  1913  3053 W ActivityManager:   Force finishing activity com.counterclinicmobile/.MainActivity
07-14 20:59:10.191  7153  7153 I Process : Sending signal. PID: 7153 SIG: 9
```

The issue was resolved once I commented the `<ScrollView></ScrollView>` from the picker. You cannot keep picker inside ScrollView causes crash.



### Getting `duplicate resources` exception while trying to build the app `assembleRelease`

Custom node_modules/react-native/react.gradle to solve the Duplicate file error perfectly. Add following code into currentBundleTask's creation block (after doFirst block)

```
doLast {
    def moveFunc = { resSuffix ->
        File originalDir = file("${resourcesDir}/drawable-${resSuffix}");
        if (originalDir.exists()) {
            File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
            ant.move(file: originalDir, tofile: destDir);
        }
    }
    moveFunc.curry("ldpi").call()
    moveFunc.curry("mdpi").call()
    moveFunc.curry("hdpi").call()
    moveFunc.curry("xhdpi").call()
    moveFunc.curry("xxhdpi").call()
    moveFunc.curry("xxxhdpi").call()
}
```
You can create script to do it automatically.

Create `android-react-gradle-fix` file
Create script `android-release-gradle-fix.js` file
Update `package.json` file:

`"scripts": { "postinstall": "node ./android-release-gradle-fix.js" },`

That's it! Run npm install to get awesome.

Note: If you run npm install on ci like jenkins, you may get error: postinstall: cannot run in wd %s %s (wd=%s) node => just use `npm install --unsafe-perm` instead


### Old version of app being built

Run following command before building the app for device:
`react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`