$ ()->
#    继承方法
    _extend = (child, parent, props={}, staticProps={})->
        child.prototype = Object.create(parent.prototype)
        for key, value of Object.create(props)
            child.prototype[key] = value
        for key, value of Object.create(parent)
            child[key] = value
        for key, value of Object.create(staticProps)
            child[key] = value
        child.prototype._super = parent.prototype
        return child

    Class = ->
        @constructor(arguments)
        @

    Class.prototype.constructor = -> @initialize(arguments)
    Class.prototype.initialize = ->
    Class.extend = (props={}, staticProps={})->
        self = @
        _Class = -> self.prototype.constructor.apply(@, arguments)
        _Class = _extend(_Class, @, props, staticProps)
        _Class.extend = -> self.extend.apply(@, arguments)
        return _Class

    Events = window.Events = -> @constructor(arguments)
    Events = _extend(Events, Class, {
        # 监听
        on: (signal, callback, ctx=@, evts = (@_events[signal] = @_events[signal] || []))-> evts.push({ callback: callback, ctx: ctx })

        # 发送
        trigger: (signal, args=[])-> (setTimeout((-> evt.callback.apply(evt.ctx, args)),1) for evt in evts) if evts = @_events[signal]
    })

    Events.prototype.constructor = ->
        @_events = {}
        @initialize(arguments)
        @


    _Sys = Events.extend({ initialize: -> })

    window.Sysweb = window.Sysweb || (-> new _Sys() )()

    fs = Sysweb.fs = (->
        _Fs = _Sys.extend({

            # 变更目录
            cd: (path)->
                $.get("/fs/cd", {
                    path: path
                })

            # 查看目录下的文件的详细信息
            ls: (path)->
                hanler = { done: ->}
                jqx = $.get("/fs/ls", {
                    path: path
                }).done((result)->
                    console.log(result)
                )

            # 查看当前目录
            pwd: ()->

            # 是否存在目录
            isDir: (path)->
                jqx = $.get("/fs/isDir",{
                    path: path
                })
                jqx.done((result)->
                    console.log(result)
                )

            # 是否存在文件
            isFile: (path)->
                $.get("/fs/isFile",{
                    path: path
                })
            # 新建文件
            touch: (path)->
                $.post("/fs/touch",{
                    path: path
                })

            # 新建文件夹
            mkdir: (path)->
                $.post("/fs/mkdir",{
                    path: path
                })

            # 删除
            rm: (path)->
                $.post("/fs/rm", {
                    path: path
                })

            # 复制
            cp: (source, dest)->
                $.post("/fs/cp", {
                    source: source
                    dest: dest
                })
            # 移动
            mv: (source, dest)->
                $.post("/fs/mv", {
                    source: source
                    dest: dest
                })

            # 查看开头几行
            head: (path, start, stop)->
                $.post("/fs/head", {
                    path: path
                    start: start
                    stop: stop
                })

            # 查看末尾几行
            tail: (path, start, stop)->
                $.post("/fs/tail", {
                    path: path
                    start: start
                    stop: stop
                })

            # 文件缓存在前端
            cache: (path)->

                # 阅读文件
            read: (path)->
                $.post("/fs/read", {
                    path: path
                })

            # 重写文件
            write: (path, text)->
                $.post("/fs/write", {
                    path: path
                    text: text
                })

            # 在文件末尾添加
            append: (path, text)->
                $.post("/fs/append", {
                    path: path
                    text: text
                })

            echo: (path, text)->
                $.post("/fs/echo", {
                    path: path
                    text: text
                })

            head: (path)->
                $.get("/fs/head",{
                    path: path
                })
        })
        new _Fs()
    )()

    Memory = Sysweb.Memory = (->
        _Memory = _Sys.extend({})
        new _Memory()
    )()

    Library = Sysweb.Library = (->
        _Library = _Sys.extend({
            initialize: -> @_libs = {}

            addLib: (name, lib)->
                if (!@_libs[name])
                    @_libs[name] = lib
                @
            getLib: (name)-> @_libs[name]
            removeLib: (name)->
                delete @_libs[name]
                @
        })
        new _Library()
    )()

    Environment = window.Sysweb.Environment = (->
        _Environment = _Sys.extend({
            initialize: -> @_envs = {}
            set: (name, value)-> @_envs[name] = value
            get: (name)-> @_envs[name]
            addBoot: (tag, path, attr, attrs='')->
                $.post("/boot", {
                    tag: tag
                    path: path
                    attr: attr
                    attrs: attrs
                })
        })
        new _Environment()
    )()

    Applicatins = window.Sysweb.Applicatins = (->
        _Apps = _Sys.extend({
            initialize: -> @_apps = {}
            set: (name, value)->
                if @_apps[name]
                    return false
                @_apps[name] = value
            get: (name)-> @_apps[name]
        })
        new _Apps()
    )()

    User = window.Sysweb.User = (->
        _Event = _Sys.extend({
            initialize: ->
                self = @
                @fetch()
                $(document).on "ajaxerror", (docevent, event, request, settings)->
                    if(request.status == 403)
                        self.trigger("forbidden", [event, request, settings])

            login: (username, password)->
                self = @
                $.post("/login", {
                    username: username,
                    password: password
                }).done((result)->
                    if(!result.error && result.user)
                        self.currentUser = result.user
                        self.trigger("logined")
                )
            register: (username, password)->
                self = @
                $.post("/register", { username: username, password: password }).done((result)->
                    if(!result.error && result.user)
                        self.currentUser = result.user
                        self.trigger("logined")
                )
            fetch: ()->
                self = @
                $.post("/user/current").done((result)->
                    if(!result.error && result.user)
                        self.currentUser = result.user
                        self.trigger("logined")
                )
        })
        new _Event()
    )()


    init = window.Sysweb.init = ->

    init.addBoot = (tag, path, attr, attrs='')->
        $.post("/boot/add", {
            tag: tag
            path: path
            attr: attr
            attrs: attrs
        })

    init.removeBoot = (path)->
        $.post("/boot/remve", { path: path })









