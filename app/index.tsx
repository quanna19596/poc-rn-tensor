import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-react-native';
import * as mobilenet from "@tensorflow-models/mobilenet";

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takeAPicture = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getImageData = async (): Promise<void> => {
    try {
      if (image) {
        await tf.ready();
        const model = await mobilenet.load();
        const img = new Image({
          src: image,
          onLoad: async () => {
            const predictions = await model.classify(img as any);
            console.log(predictions);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take a picture" onPress={takeAPicture} />
      {image && (
        <View>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title="Get image data" onPress={getImageData} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
