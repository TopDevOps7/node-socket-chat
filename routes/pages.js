const express = require('express');
const router = express.Router();
const PageSchema = require('../maria_models/Page');

router.get('/legal-agreements', async (req, res) => {
  const privacy = await PageSchema.findOne({where : { slug: 'privacy-policy' }});
  const agreement = await PageSchema.findOne({where : { slug: 'user-agreement' }});

  if (!privacy) {
    await PageSchema.create({
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: ''
    });
  }

  if (!agreement) {
    await PageSchema.create({
      title: 'User Agreement',
      slug: 'user-agreement',
      content: ''
    });
  }

  res.json({
    success: true,
    pages: {
      privacy: privacy?privacy.content:"",
      agreement: agreement?agreement.content:""
    }
  });
});

router.put('/privacy-policy', async (req, res) => {
  const privacy = await PageSchema.update({ content: req.body.content }, {where : { slug: 'privacy-policy' }});

  if (!privacy) {
    await PageSchema.create({
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: req.body.content
    });
  }

  res.json({
    success: true,
    message: 'Policy updated.'
  });
});

router.get('/privacy-policy', async (req, res) => {
  const privacy = await Page.findOne({where : { slug: 'privacy-policy' }});

  if (!privacy) {
    await PageSchema.create({
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: ''
    });
  }

  const content = privacy?privacy.content:"";
  res.json({
    success: true,
    content
  });
});

router.put('/user-agreement', async (req, res) => {
  const userAgreement = await Page.update({ content: req.body.content }, {where : { slug: 'user-agreement' }});

  if (!userAgreement) {
    await PageSchema.create({
      title: 'User Agreement',
      slug: 'user-agreement',
      content: req.body.content
    });
  }

  res.json({
    success: true,
    message: 'User agreement updated.'
  });
});

router.get('/user-agreement', async (req, res) => {
  const agreement = await Page.findOne({ slug: 'user-agreement' });

  if (!agreement) {
    await PageSchema.create({
      title: 'User Agreement',
      slug: 'user-agreement',
      content: ''
    });
  }

  const content = agreement?agreement.content:"";
  res.json({
    success: true,
    content
  });
});

module.exports = router;
