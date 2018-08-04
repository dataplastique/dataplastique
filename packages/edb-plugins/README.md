# IOPlugin API Working Draft

```js
this.io.on(UserModel, user => this.script.run(user));
this.io.off(UserModel, XXX);
```

```js
this.io.on(
		[ModelOne, ModelTwo, ModelThree], 
		([one, two, three]) => this.script.run(one, two, three)
	);
this.io.off([ModelOne, ModelTwo, ModelThree], XXX);
```

```js
this.io.on([
		this.io.one(UserModel),
		this.io.all(ModelOne, ModelTwo, ModelThree),
		this.io.any(CollectinOne, CollectionTwo)
	], ([ user, one, two, three, col ]) => {
		this.script.run(user, one, two, three, col);
	});

this.io.on([
		UserModel,
		[ModelOne, ModelTwo, ModelThree],
		{ CollectinOne, CollectionTwo }
	], (result) => {
		this.script.run(...result);
	});
```