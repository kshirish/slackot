const Notification = require('../models/notification');
const User = require('../models/user');
const Room = require('../models/room');

module.exports = io => {

	io.sockets.on('connection', socket => {

	    socket.on('joined a room', ({username, roomId}) => {
	    	
	    	let online;

	    	socket.username = username;
	    	socket.join(roomId);

	    	socket.emit('personal message from server', `Welcome aboard! ${username}`);

	    	Room.findById({_id: roomId})
				.then(room => {

					online = room.online;
					return Room.update({_id: roomId}, {$push: {online: socket.username}})
				})
				.then((room) => {

					online = online.concat(socket.username);
					
		    		// sending to all clients in the room including sender
			    	io.sockets.in(roomId).emit('broadcast message from server', {
			    		type: 'online',
			    		clients: Array.from(new Set(online)),
			    		message: `${username} has just joined!`
			    	});
				})
				.catch(() => console.log('Failed in adding a user to online.'));
	    });

	    socket.on('left a room', ({roomId}) => {
	    	
	    	let online;

	    	socket.leave(roomId);	    	
	    	socket.emit('personal message from server', `Sorry, to see you go! ${username}`);

	    	Room.findById({_id: roomId})
				.then(room => {

					online = room.online;
					return Room.update({_id: roomId}, {$pull: {online: socket.username}})
				})
				.then((room) => {

					online.splice(online.indexOf(socket.username), 1);

		    		// sending to all clients in the room including sender
			    	io.sockets.in(roomId).emit('broadcast message from server', {
			    		type: 'online',
			    		clients: Array.from(new Set(online)),
			    		message: `${username} has just left!`
			    	});
				})
				.catch(() => console.log('Failed in removing a user from online.'));
	    });

	    // listens for a new notification
	    socket.on('message from client', data => {
	        
			const _id = data.roomId;
			const {content, username} = data;

			Room.findById({_id})
				.then(room => {

					const notification = new Notification({content, username});
					return notification.save();
				})
				.then((notification) => {

					socket.broadcast.to(_id).emit('broadcast message from server', {
			    		type: 'room',
			    		username,
			    		content
					});
					
					return Room.update({_id}, {$push: {notifications: notification._id}})
				})
				.then(() => console.log('Notification sent successfully'))
				.catch(() => console.log('Error in getting notifications for this room'));
	    });

	});
}