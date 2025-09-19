using System;
using System.Threading.Tasks;
using System.Windows.Input;

namespace CAM_API.Common.Commands
{
    public class RelayCommand : ICommand
    {
        private readonly Func<object, Task> _executeAsync;
        private readonly Predicate<object> _canExecute;
        private readonly Action<Exception> _onError;

        public RelayCommand(Action execute, Func<bool> canExecute = null, Action<Exception> onError = null)
           : this(param =>
           {
               execute();
               return Task.CompletedTask;
           }, canExecute == null ? null : (Predicate<object>)(param => canExecute()), onError)
        { }

        public RelayCommand(Action<object> execute, Predicate<object> canExecute = null, Action<Exception> onError = null)
            : this(param =>
            {
                execute(param);
                return Task.CompletedTask;
            }, canExecute, onError)
        {}


        public RelayCommand(Func<object, Task> executeAsync, Predicate<object> canExecute = null, Action<Exception> onError = null)
        {
            _executeAsync = executeAsync ?? throw new ArgumentNullException(nameof(executeAsync));
            _canExecute = canExecute;
            _onError = onError;
        }

        public bool CanExecute(object parameter) => _canExecute == null || _canExecute(parameter);

        public async void Execute(object parameter)
        {
            try
            {
                await _executeAsync(parameter);
            }
            catch (Exception ex)
            {
                _onError?.Invoke(ex);
                // 필요시 예외 로깅
            }
        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public void RaiseCanExecuteChanged() => CommandManager.InvalidateRequerySuggested();
    }

    // 타입 안전한 버전
    public class RelayCommand<T> : ICommand
    {
        private readonly Func<T, Task> _executeAsync;
        private readonly Predicate<T> _canExecute;
        private readonly Action<Exception> _onError;

        public RelayCommand(Action<T> execute, Predicate<T> canExecute = null, Action<Exception> onError = null)
            : this(param => Task.Run(() => execute(param)), canExecute, onError)
        {
        }

        public RelayCommand(Func<T, Task> executeAsync, Predicate<T> canExecute = null, Action<Exception> onError = null)
        {
            _executeAsync = executeAsync ?? throw new ArgumentNullException(nameof(executeAsync));
            _canExecute = canExecute;
            _onError = onError;
        }

        public bool CanExecute(object parameter)
        {
            if (parameter == null)
            {
                if (typeof(T).IsValueType && Nullable.GetUnderlyingType(typeof(T)) == null)
                    return _canExecute == null;

                return _canExecute == null || _canExecute(default(T));
            }

            if (parameter is T value)
                return _canExecute == null || _canExecute(value);

            return false;
        }

        public async void Execute(object parameter)
        {
            try
            {
                if (parameter is T value)
                    await _executeAsync(value);
            }
            catch (Exception ex)
            {
                _onError?.Invoke(ex);
            }
        }

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public void RaiseCanExecuteChanged() => CommandManager.InvalidateRequerySuggested();
    }
}
