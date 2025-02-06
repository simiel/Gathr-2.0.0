import * as ImagePicker from "expo-image-picker";

export async function requestPermissions() {
  try {
    // Camera permissions
    const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
    if (!cameraStatus.granted) {
      await ImagePicker.requestCameraPermissionsAsync();
    }

    // Photo library permissions
    const libraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!libraryStatus.granted) {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  } catch (error) {
    console.warn("Error requesting permissions:", error);
  }
}
