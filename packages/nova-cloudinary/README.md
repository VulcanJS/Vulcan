Telescope file upload package, used internally. 

### Custom Posts Fields

- `cloudinaryId`
- `cloudinaryUrls`

### Public Settings

- `cloudinaryCloudName`
- `cloudinaryFormats`

### Private Settings

- `cloudinaryAPIKey`
- `cloudinaryAPISecret`

### Sample Settings

```js
{
  "public": {
    "cloudinaryCloudName": "myCloudName",
    "cloudinaryFormats": [
      {
        "name": "small",
        "width": 120,
        "height": 90
      },
      {
        "name": "medium",
        "width": 480,
        "height": 360
      }
    ]
  },
  "cloudinaryAPIKey": "abcfoo",
  "cloudinaryAPISecret": "123bar",
}
```