const {
  Configuration,
  AuthenticationApi,
  FriendsApi,
  NotificationsApi,
} = require("vrchatapi");
const winston = require("winston");

const configuration = new Configuration({
  apiKey: {
    apiKeyAuth: `Basic ${Buffer.from(
      `${process.env.USERNAME}:${process.env.PASSWORD}`
    ).toString("base64")}`,
  },
});

const authenticationApi = new AuthenticationApi(configuration);
const friendsApi = new FriendsApi(configuration);
const notificationsApi = new NotificationsApi(configuration);

const worldId = process.env.WORLD_ID;
const instanceId = process.env.INSTANCE_ID;

const logLevel = process.env.LOG_LEVEL || "info";

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "MM-DD-YYYY-HH:mm:ss:SSS" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} ${level.toUpperCase()} ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: "vrchat-bot.log",
      level: logLevel,
    }),
  ],
});

authenticationApi
  .getCurrentUser()
  .then((resp) => {
    logger.info(`Logged in as: ${resp.data.displayName}`);
    checkAndHandleNotifications();
    setInterval(checkAndHandleNotifications, 10000); // Check every 10 seconds
  })
  .catch((error) => {
    logger.error(`Failed to log in: ${error}`);
  });

async function checkAndHandleNotifications() {
  try {
    const notifications = await notificationsApi.getNotifications();
    for (const notification of notifications.data) {
      if (notification.type === "friendRequest") {
        await friendsApi.acceptFriend(notification.senderUserId);
        logger.info(
          `Accepted friend request from: ${notification.senderUsername}`
        );
      } else if (notification.type === "invite") {
        await notificationsApi.deleteNotification(notification.id);
        logger.info(`Received invite from: ${notification.senderUsername}`);
        const inviteData = {
          worldId: `${worldId}:${instanceId}`,
          rsvp: "yes",
        };
        await notificationsApi.sendInvite(
          notification.senderUserId,
          inviteData
        );
        logger.info(`Sent invite to: ${notification.senderUsername}`);
      }
    }
  } catch (error) {
    logger.error(`Error handling notifications: ${error}`);
  }
}
