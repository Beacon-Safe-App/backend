const db = require('../models')

const createLocation = (req, res) => {
    db.locations.create(req.body)
        .then((createdLocation) => {
            if (!createdLocation) {
                res.status(400).json({ message: 'Cannot create location' })
            } 
            // else if (!req.userData.id) {
            //     res.status(401).json({ message: 'User unauthenticated' })
            // }
             else {
                res.status(201).json({ data: createdLocation, message: 'location created' })
            }
        })
}

const getLocations = (req, res) => {
    db.locations.find({})
    .then((foundLocations) => {
        if (!foundLocations) {
            res.status(404).json({ message: 'Cannot find locations' })
        } 
        // else if (!req.userData.id) {
        //     res.status(401).json({ message: 'User unauthenticated' })
        // } 
        else {
            res.status(200).json({ data: foundLocations })
        }
    })
}

const updateLocation = (req, res) => {
    db.locations.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedLocation) => {
            if (!updatedLocation) {
                res.status(400).json({ Message: 'Could not update location' })
            } 
            // else if (!req.userData.id) {
            //     res.status(401).json({ message: 'User unauthenticated' })
            // }
            else {
                res.status(200).json({ Data: updatedLocation, Message: "location updated" })
            }
        })
}

const deleteLocation = (req, res) => {
    db.locations.findByIdAndDelete(req.params.id)
        .then((deletedLocation) => {
            if (!deletedLocation) {
                res.status(400).json({ Message: 'Could not delete location' })
            }   
            // else if (!req.userData.id) {
            //     res.status(401).json({ message: 'User unauthenticated' })
            // } 
            else {
                res.status(200).json({ Data: deletedLocation, Message: "location deleted" })
            }
        })
}

module.exports = {
    createLocation,
    getLocations,
    updateLocation,
    deleteLocation
}