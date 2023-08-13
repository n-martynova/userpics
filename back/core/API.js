const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram/tl");
const { generateRandomBigInt } = require("telegram/Helpers");
const input = require("input");
const path = require("path");
const e = require("express");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const apiId = +process.env.API_ID;
const apiHash = process.env.API_HASH;
// const stringSession = new StringSession("");
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNTEBu31RLS9xsPzqPbNPw9eK4lf1u4Lje1vsONfUL7zFVphnWAl+WwIxuubAUMr8OPimfElwPJuVWqfLFyq6cfl1Zc6WMQUy67MPjfmORGl1TUrBgFoNAEPWcnC50/DI/OvQXlUb1V/Xzbb8EJi/ZOubxqaq+a/WVTiEVnjYMMIZ3DJdizXv16aRpawqjAGMfn5hK7KvqwEchih505IarorHz8lPjD1lQbODZulG+WXDzELwt+EtbhlMWU5LrBIsAybM7Ln7XSkaMdDQTOZyjQKhRITxlKJ7ALmRNJ9lSaaNNIVSnQqM+3tVgicWPHlZlbzQcxlcghohClNRMN2iStUkkQ4="); // me

const initTgApi = async (numbers, waClient) => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
    maxConcurrentDownloads: 1,
  });
//   await client.start({
//     phoneNumber: async () => await input.text("Please enter your number: "),
//     password: async () => await input.text("Please enter your password: "),
//     phoneCode: async () =>
//       await input.text("Please enter the code you received: "),
//     onError: (err) => console.log(err),
//   });
  await client.start();
  console.log("You should now be connected.");
  const contacts = [];
//   console.log(client.session.save()); // Save this string to avoid logging in again
    // ['79115588988'].forEach((number) => {
    // ['79636225881', '79115588988'].forEach((number) => {
    numbers.forEach((number) => {
        contacts.push(new Api.InputPhoneContact({
            clientId: generateRandomBigInt(),
            phone: number,
            firstName: "x",
            lastName: "y",
          })
        );
    });
    ///////////////////
    const number = '79115588988';

    const importedUsers = (await client.invoke(new Api.contacts.ImportContacts({ 
        contacts: [
            new Api.InputPhoneContact({
                clientId: generateRandomBigInt(),
                phone: number, // number of an already added contact
                firstName: "x",
                lastName: "y",
            })
        ]
    }))).users;
    console.log('importedUsers', importedUsers);
    const photos = (await client.invoke(
        new Api.photos.GetUserPhotos({
            userId: user.id,
        }))).photos;
    console.log('photos', photos);
    ///////////////////

    // const usersArr = (await client.invoke(new Api.contacts.ImportContacts({ contacts }))).users;
    // const users = {};
    // console.log('contacts', usersArr);

    for (const user of usersArr) {
        users[user.phone] = {};
        users[user.phone].photos = (await client.invoke(
            new Api.photos.GetUserPhotos({
              userId: user.id,
            })
          )).photos;

    const getBase64File = async (photo, user) => {
        try {
        const buffer = await client.downloadFile(
            new Api.InputPeerPhotoFileLocation({
                    peer: new Api.InputPeerUser({
                        userId: user.id,
                        accessHash: user.access_hash,
                    }),
                    big: true,
                    photoId: photo.id
                })
            );
            return `data:image/jpg;base64,${buffer.toString('base64')}`;
        } catch (err) {
            // console.log(err);
            return '';
        }
    }

        await Promise.all(
            users[user.phone].photos.map((photo) => getBase64File(photo, user))
        ).then((pics) => {
            users[user.phone].photos = pics.filter((photo) => photo);
        }).catch((err) => {
            console.log(err);
        });
        
        users[user.phone].tgBio = (await client.invoke(
            new Api.users.GetFullUser({ id: user.id })
        )).fullUser.about;

        const waUrl = await waClient.getProfilePicUrl(`${user.phone}@c.us`);
        if (waUrl) {
            users[user.phone].photos.push(waUrl);
        }
    }
    console.log(users);
    return users;
};

module.exports = { initTgApi };