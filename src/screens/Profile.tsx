import { Button } from "@components/Button"
import { Input } from "@components/Input"
import { ScreenHeader } from "@components/ScreenHeader"
import { UserPhoto } from "@components/UserPhoto"
import { VStack, Text, Center, Heading, useToast } from "@gluestack-ui/themed"
import { ScrollView, TouchableOpacity } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"
import { ToastMessage } from "@components/ToastMessage"
import { Controller, useForm } from "react-hook-form"
import { useAuth } from "@hooks/useAuth"

type FormDataProps = {
  name: string
  email: string
  password: string
  old_password: string
  confirm_password: string
}

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), "", "A confirmação de senha não confere"])
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Informe a confirmação da senha")
          .transform((value) => (!!value ? value : null)),
    }),
})

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https:github.com/gabrielpdb.png")
  const toast = useToast()
  const { user } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Essa imagem é muito grande. Escolha uma de até 5MB"
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        setUserPhoto(photoURI)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data)
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: userPhoto }}
            alt="Foto do usuário"
            size="xl"
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize={"$md"}
              mt="$2"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </Center>
          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize={"$md"}
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  bg="$gray600"
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  bg="$gray600"
                  onChangeText={onChange}
                  secureTextEntry
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  bg="$gray600"
                  onChangeText={onChange}
                  secureTextEntry
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
