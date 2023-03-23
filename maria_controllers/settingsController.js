"use strict";
//created by Leo
const Joi = require('joi');
const {settingsSchemaModel} = require('../maria_models/settingsModel');

module.exports = {

    saveParameterSettings: async (req, res) => {
        const settings = await settingsSchemaModel.findOne({where : {type: "parameter"}});
        if (settings)
            await settingsSchemaModel.update({settings: req.body}, {where : {type: "parameter"}});
        else
            await settingsSchemaModel.create({type: 'parameter', settings: req.body});
        res.json({
            success: true,
            message: 'Parameter Settings Updated !'
        });
    },

    saveSettings: async (req, res) => {
        if (!req.params.type) {
            return res.json({
                success: false,
                message: 'None of type parameter'
            });
        }
        const settings = await settingsSchemaModel.findOne({ where : {type: req.params.type}});

        if (!settings) {
            await settingsSchemaModel.create({
               type: req.params.type,
                settings: req.body
            });
        }
        else {
            let newSettings = {
                ...settings.settings,
                ...req.body
            };
            await settingsSchemaModel.update({settings: newSettings}, {where : {type: req.params.type}});
        }
        
        res.json({
            success: true,
            message: 'Settings Updated !'
        });
    },

    getParameterSettings: async (req, res) => {
        console.log("getParameterSettings");
        const parameterSettings = await settingsSchemaModel.findOne({ where : {type: "parameter"}});

        if (!parameterSettings) {
            res.status(500).json({error: true, data: "no settings found !"});
        } else {
            res.status(200).json({error: false, data: parameterSettings.settings});
        }

    },

    getSettings: async (req, res) => {
        console.log("getSettings");
        if (!req.params.type) {
            return res.json({
                success: false,
                message: 'None of type parameter'
            });
        }
        const settings = await settingsSchemaModel.findOne({ where : {type: req.params.type}});
        if (!settings) {
            res.status(500).json({error: true, data: "no settings found !"});
        } else {
            res.status(200).json({error: false, data: settings.settings});
        }

    },

    getAllSettings: async (req, res) => {

        const settings = await settingsSchemaModel.findAll();

        if (!settings) {
            res.status(500).json({error: true, data: "no settings found !"});
        } else {
            res.status(200).json({error: false, settings: settings});
        }
    }    
};