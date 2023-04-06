import Pusher from 'pusher';

// Set up Pusher
export const pusher = new Pusher({
  appId: 'your_pusher_app_id',
  key: 'your_pusher_key',
  secret: 'your_pusher_secret',
  cluster: 'your_pusher_cluster',
  useTLS: true,
});

export default pusher;
