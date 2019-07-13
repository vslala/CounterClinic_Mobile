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