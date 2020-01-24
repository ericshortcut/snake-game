function database(database){
    return {
        store(key, value){
            const namespace = [database, "/", key ].join("");
            localStorage.setItem( namespace, JSON.stringify(value) );
        },
        get(key) {
            const namespace = [database, "/", key].join("");
            return JSON.parse( localStorage.getItem(namespace) );
        }
    };
}